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
    const getTick = (timerName, stopFunc) => () => {
        const timer = timers[timerName]
        const { count } = timer
        const newCount = count + 1
        timers[timerName].count = newCount
        onTick(timerName, newCount)
        if (stopFunc && stopFunc(newCount)) {
            stop(timerName, true)
        }
    }
    const start = (timerName, stopFunc) => {
        const timer = setInterval(getTick(timerName, stopFunc), 1000)
        const deferred = getDeferred()
        timers[timerName] = {
            deferred,
            handler: timer,
            count: 0
        }
        return deferred.promise
    }
    return {
        startFor: (timerName, duration) => start(timerName, count => count === duration),
        start,
        stop
    }
}

module.exports = {
    getTimerHandler
}
