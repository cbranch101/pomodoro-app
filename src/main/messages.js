const { getMessageMap: getTimerMessageMap } = require("./timer.js")

const getMessageHandler = ({ trayIcon, sendResponse }) => (
    event,
    { name: messageName, payload: messagePayload }
) => {
    const timerMessageMap = getTimerMessageMap({ trayIcon, sendResponse })
    const { type, payload } = messagePayload
    if (messageName === "timer") {
        timerMessageMap[type](payload)
    }
}

module.exports = {
    getMessageHandler
}
