import React from "react"
import TaskOverview from "./TaskOverview"

class WorkDay extends React.Component {
    state = {
        activeTaskId: null
    }
    startWorking = taskId => {
        this.setState({ activeTaskId: taskId })
    }
    stopWorking = () => {
        this.setState({ activeTaskId: null })
    }
    render() {
        return (
            <TaskOverview
                activeTaskId={this.state.activeTaskId}
                onClickBackToList={this.stopWorking}
                onClickStartTask={this.startWorking}
            />
        )
    }
}

export default WorkDay
