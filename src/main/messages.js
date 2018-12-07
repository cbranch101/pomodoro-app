const { getMessageMap: getTimerMessageMap } = require("./timer.js")
const { getCollections, getMessageHandler: getDatabaseMessageHandler } = require("./database.js")

const getMessageHandler = ({ trayIcon, sendResponse }) => {
    const collections = getCollections()
    const timerMessageMap = getTimerMessageMap({ trayIcon, sendResponse, collections })
    const databaseMessageHandler = getDatabaseMessageHandler({ collections, sendResponse })
    return (event, { name: messageName, payload: messagePayload }) => {
        const { type, payload } = messagePayload
        if (messageName === "timer") {
            return timerMessageMap[type](payload)
        }
        if (messageName === "database") {
            return databaseMessageHandler(type, payload)
        }
    }
}

module.exports = {
    getMessageHandler
}
