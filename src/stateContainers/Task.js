import { Container } from "unstated"

class Task extends Container {
    state = {
        workedOnTask: null
    }
    startWorking = id => {
        this.setState({
            workedOnTask: id
        })
    }
    stopWorking = () => {
        this.setState({
            workedOnTask: null
        })
    }
}

export default Task
