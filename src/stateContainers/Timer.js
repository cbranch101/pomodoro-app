import { Container } from "unstated"
import { createApi } from "../render-main-api"

class Timer extends Container {
    api = null
    constructor(props) {
        super(props)
        const { ipcRenderer } = window.require("electron")
        const listenToChannel = onChannel =>
            ipcRenderer.on("timer-message", (event, message) => onChannel(message))
        const sendMessage = message => ipcRenderer.send("timer-message", message)
        this.api = createApi(listenToChannel, sendMessage)
    }
    sendMessage = (name, payload = {}) => {
        return this.api.sendMessage({
            name,
            payload
        })
    }
    stop = () => {
        const nameToStop = this.state.status === "IN_POM" ? "stopPom" : "stopBreak"
        this.sendMessage(nameToStop)
    }
    startPom = async () => {
        this.setState({ status: "IN_POM" })
        const response = await this.sendMessage("startPom")
        const nextStatus = response.isCompleted ? "WAITING_TO_START_BREAK" : "WAITING_TO_START_POM"
        this.setState({ status: nextStatus })
    }
    startBreak = async () => {
        this.setState({ status: "IN_BREAK" })
        await this.sendMessage("startBreak")
        this.setState({ status: "WAITING_TO_START_POM" })
    }

    state = {
        status: "WAITING_TO_START_POM"
    }
}

export default Timer
