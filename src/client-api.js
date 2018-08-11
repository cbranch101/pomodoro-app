const getDeferred = () => {
    const deferred = {}
    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return Object.assign({}, deferred, { promise })
}

export const createApi = (listenToChannel, sendMessageToMain) => {
    const inflightMessages = {}
    listenToChannel(({ name, payload }) => {
        if (inflightMessages[name]) {
            inflightMessages[name].resolve(payload)
            delete inflightMessages[name]
        }
    })

    return {
        sendMessage: message => {
            const deferred = getDeferred()
            inflightMessages[message.name] = deferred
            sendMessageToMain(message)
            return deferred.promise
        }
    }
}
