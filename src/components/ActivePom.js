import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import React from "react"
import Timer from "../stateContainers/Timer"
import Database from "../stateContainers/Database"

class ActivePom extends React.Component {
    handleStartPom = ({ timer: { startPom }, database: { addPomToTasks } }) => async () => {
        const { pom } = await startPom(this.props.task.id)
        addPomToTasks(pom)
    }
    render() {
        const { task, backToTaskList } = this.props
        return (
            <Subscribe to={[Timer, Database]}>
                {unstatedProps => {
                    const { timer } = unstatedProps
                    const { status } = timer.state
                    const { startPom, startBreak, stop } = timer
                    const waitingToStartPom = status === "WAITING_TO_START_POM"
                    return (
                        <div>
                            <p>{task.name}</p>
                            {status === "IN_POM" || status === "IN_BREAK" ? (
                                <button onClick={stop}>Stop</button>
                            ) : (
                                <button
                                    onClick={
                                        waitingToStartPom ? () => startPom(task.id) : startBreak
                                    }
                                >
                                    Start {waitingToStartPom ? "Pom" : "Break"}
                                </button>
                            )}
                            {status !== "IN_POM" && (
                                <button onClick={backToTaskList}>Go To Task List</button>
                            )}
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
