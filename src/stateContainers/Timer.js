import { Container } from "unstated"

class Timer extends Container {
    api = null
    constructor(props) {
        super(props)
        this.api = props.api
    }
    startSession = type => {
        this.sendTimerMessage("startSession", { type })
    }
    stopSession = type => {
        this.sendTimerMessage("stopSession", { type })
    }
    sendTimerMessage = async (type, payload = {}) => {
        const response = await this.api.sendMessage({
            name: "timer",
            payload: {
                type,
                payload
            }
        })
        return response.payload
    }
    stop = () => {
        const nameToStop = this.state.status === "IN_POM" ? "stopPom" : "stopBreak"
        this.sendTimerMessage(nameToStop)
    }
    startPom = async taskId => {
        this.setState({ status: "IN_POM" })
        const { isCompleted, pom } = await this.sendTimerMessage("startPom", { taskId })
        this.startSession("untracked")
        const nextStatus = isCompleted ? "WAITING_TO_START_BREAK" : "WAITING_TO_START_POM"
        this.setState({ status: nextStatus })
        return { isCompleted, pom }
    }
    startBreak = async () => {
        this.stopSession("untracked")
        this.setState({ status: "IN_BREAK" })
        await this.sendTimerMessage("startBreak")
        this.startSession("untracked")
        this.setState({ status: "WAITING_TO_START_POM" })
    }

    state = {
        status: "WAITING_TO_START_POM"
    }
}

export default Timer
