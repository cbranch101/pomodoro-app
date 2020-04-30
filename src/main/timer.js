const { updateTrayIconWithSecondsRemaining, emptyTrayIcon } = require("./tray-icon.js")
const moment = require("moment")

const getDeferred = () => {
    const deferred = {}
    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return Object.assign({}, deferred, { promise })
}

const getTimerHandler = onTick => {
    const timers = {}
    const stop = (timerName, isCompleted = false) => {
        const currentTimer = timers[timerName]
        if (currentTimer) {
            const { handler, deferred, count } = currentTimer
            clearInterval(handler)
            deferred.resolve({ count, isCompleted })
            delete timers[timerName]
        }
    }
    const getTick = (timerName, stopFunc, getReturnValue) => () => {
        const timer = timers[timerName]
        const { count } = timer
        const newCount = count + 1
        timers[timerName].count = newCount
        const returnValue = getReturnValue ? getReturnValue(newCount) : newCount
        onTick(timerName, returnValue)
        if (stopFunc && stopFunc(newCount)) {
            stop(timerName, true)
        }
    }
    const start = (timerName, stopFunc, getReturnValue) => {
        const timer = setInterval(getTick(timerName, stopFunc, getReturnValue), 1000)
        const deferred = getDeferred()
        timers[timerName] = {
            deferred,
            handler: timer,
            count: 0
        }
        return deferred.promise
    }
    return {
        startFor: (timerName, duration) =>
            start(
                timerName,
                count => count === duration,
                count => ({
                    current: count,
                    remaining: duration - count
                })
            ),
        start,
        stop
    }
}

const getMessageMap = ({ trayIcon, sendResponse, collections }) => {
    const timerHandler = getTimerHandler((timerName, returnValue) => {
        if (timerName === "pom" || timerName === "break") {
            const { remaining: secondsRemaining } = returnValue
            updateTrayIconWithSecondsRemaining(trayIcon, secondsRemaining)
        }
        if (timerName === "untracked") {
            updateTrayIconWithSecondsRemaining(trayIcon, returnValue, true)
        }
    })

    const sendTimerResponse = ({ type, payload }) =>
        sendResponse({
            name: "timer",
            payload: {
                type,
                payload
            }
        })

    const recordSession = async type => {
        const duration = await timerHandler.start("untracked", undefined)
        const session = await collections.sessions.insert({
            createdAt: moment.unix(),
            type,
            duration
        })
        return session
    }

    return {
        startPom: async ({ taskId }) => {
            const response = await timerHandler.startFor("pom", 5)
            emptyTrayIcon(trayIcon)
            const newItem = await collections.poms.insert({
                completed: response.isCompleted,
                duration: response.count,
                createdAt: moment().unix(),
                taskId
            })
            sendTimerResponse({
                type: "startPom",
                payload: Object.assign({}, response, { pom: newItem })
            })
        },
        startBreak: async () => {
            const response = await timerHandler.startFor("break", 5)
            emptyTrayIcon(trayIcon)
            sendTimerResponse({
                type: "startBreak",
                payload: response
            })
        },
        stopSession: ({ type }) => {
            timerHandler.stop(type)
        },
        startSession: async ({ type }) => {
            const session = await recordSession(type)
            sendTimerResponse({
                type: "startSession",
                payload: session
            })
        },
        stopPom: () => {
            timerHandler.stop("pom")
        },
        stopBreak: () => {
            timerHandler.stop("break")
        }
    }
}

module.exports = {
    getTimerHandler,
    getMessageMap
}
