const getDeferred = () => {
    const deferred = {}
    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return Object.assign({}, deferred, { promise })
}

const getMessageName = (name, payload) => `${name}_${payload.type}`

export const createApi = (listenToChannel, sendMessageToMain) => {
    const inflightMessages = {}

    listenToChannel(({ name, payload }) => {
        const messageName = getMessageName(name, payload)
        if (inflightMessages[messageName]) {
            inflightMessages[messageName].resolve(payload)
            delete inflightMessages[messageName]
        }
    })

    return {
        sendMessage: message => {
            const messageName = getMessageName(message.name, message.payload)
            const deferred = getDeferred()
            inflightMessages[messageName] = deferred
            sendMessageToMain(message)
            return deferred.promise
        }
    }
}
