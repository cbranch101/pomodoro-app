import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "unstated"
import { createApi } from "./render-main-api"

import App from "./App"
import Timer from "./stateContainers/Timer"

const { ipcRenderer } = window.require("electron")
const listenToChannel = onChannel =>
    ipcRenderer.on("timer-message", (event, message) => onChannel(message))
const sendMessage = message => ipcRenderer.send("timer-message", message)
const api = createApi(listenToChannel, sendMessage)

const timer = new Timer({
    api
})

ReactDOM.render(
    <Provider inject={[timer]}>
        <App />
    </Provider>,
    document.getElementById("root")
)
