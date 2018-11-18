import { Container } from "unstated"

class Timer extends Container {
    constructor(props) {
        super(props)
        this.api = props.api
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
    startPom = async () => {
        this.setState({ status: "IN_POM" })
        const { isCompleted } = await this.sendTimerMessage("startPom")
        const nextStatus = isCompleted ? "WAITING_TO_START_BREAK" : "WAITING_TO_START_POM"
        this.setState({ status: nextStatus })
    }
    startBreak = async () => {
        this.setState({ status: "IN_BREAK" })
        await this.sendTimerMessage("startBreak")
        this.setState({ status: "WAITING_TO_START_POM" })
    }

    state = {
        status: "WAITING_TO_START_POM"
    }
}

export default Timer
