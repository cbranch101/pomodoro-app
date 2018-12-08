import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Timer from "../stateContainers/Timer"
import PrePom from "./PrePom"
import InPom from "./InPom"
import PreBreak from "./PreBreak"
import InBreak from "./InBreak"
import Database from "../stateContainers/Database"

class ActivePom extends React.Component {
    handleStartPom = ({
        timer: { startPom },
        database: { addPomToTasks, fetchSummary }
    }) => async () => {
        const { pom } = await startPom(this.props.task.id)
        addPomToTasks(pom)
        fetchSummary()
    }
    setTaskAsCompleted = ({ database: { updateTask } }) => {
        updateTask(this.props.task.id, { completed: true })
    }
    startBreak = async unstatedProps => {
        const {
            timer: { startBreak }
        } = unstatedProps
        return await startBreak()
    }
    handleClickCompleteTask = unstatedProps => async () => {
        this.setTaskAsCompleted(unstatedProps)
        await this.startBreak(unstatedProps)
        this.props.backToTaskList()
    }
    handleClickStillWorkingOnTask = unstatedProps => async () => {
        await this.startBreak(unstatedProps)
    }
    renderButtons = unstatedProps => {
        const { backToTaskList } = this.props
        const { timer } = unstatedProps
        const { status } = timer.state
        const { stop } = timer
        const handleStartPom = this.handleStartPom(unstatedProps)
        if (status === "WAITING_TO_START_POM") {
            return <PrePom onClickStart={handleStartPom} onClickBack={backToTaskList} />
        }
        if (status === "IN_POM") {
            return <InPom onClickStop={stop} />
        }
        if (status === "WAITING_TO_START_BREAK") {
            return (
                <PreBreak
                    onClickCompleted={this.handleClickCompleteTask(unstatedProps)}
                    onClickStillWorking={this.handleClickStillWorkingOnTask(unstatedProps)}
                />
            )
        }

        if (status === "IN_BREAK") {
            return <InBreak onClickStop={stop} />
        }
    }
    render() {
        const { task } = this.props
        return (
            <Subscribe to={[Timer, Database]}>
                {(timer, database) => {
                    const unstatedProps = {
                        timer,
                        database
                    }
                    return (
                        <div>
                            <p>{task.name}</p>
                            {this.renderButtons(unstatedProps)}
                        </div>
                    )
                }}
            </Subscribe>
        )
    }
}

ActivePom.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    backToTaskList: PropTypes.func.isRequired
}

export default ActivePom
