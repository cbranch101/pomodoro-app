const { updateTrayIconWithSecondsRemaining, emptyTrayIcon } = require("./tray-icon.js")

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

const getMessageMap = ({ trayIcon, sendResponse }) => {
    const timerHandler = getTimerHandler((timerName, { remaining: secondsRemaining }) => {
        updateTrayIconWithSecondsRemaining(trayIcon, secondsRemaining)
    })

    const sendTimerResponse = ({ type, payload }) =>
        sendResponse({
            name: "timer",
            payload: {
                type,
                payload
            }
        })
    return {
        startPom: () => {
            timerHandler.startFor("pom", 10).then(response => {
                emptyTrayIcon(trayIcon)
                sendTimerResponse({
                    type: "startPom",
                    payload: response
                })
            })
        },
        startBreak: () => {
            timerHandler.startFor("break", 5).then(response => {
                emptyTrayIcon(trayIcon)
                sendTimerResponse({
                    type: "startBreak",
                    payload: response
                })
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
