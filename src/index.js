import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "unstated"
import { createApi } from "./render-main-api"
import getContainers from "./get-containers"

import App from "./App"

const { ipcRenderer } = window.require("electron")
const listenToChannel = onChannel =>
    ipcRenderer.on("timer-message", (event, message) => onChannel(message))
const sendMessage = message => ipcRenderer.send("timer-message", message)
const api = createApi(listenToChannel, sendMessage)

ReactDOM.render(
    <Provider inject={getContainers(api)}>
        <App />
    </Provider>,
    document.getElementById("root")
)
