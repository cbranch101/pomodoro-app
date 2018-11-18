import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Timer from "../stateContainers/Timer"

const ActivePom = ({ task, backToTaskList }) => {
    return (
        <Subscribe to={[Timer]}>
            {timer => {
                const { status } = timer.state
                const { startPom, startBreak, stop } = timer
                const waitingToStartPom = status === "WAITING_TO_START_POM"
                return (
                    <div>
                        <p>{task.name}</p>
                        {status === "IN_POM" || status === "IN_BREAK" ? (
                            <button onClick={stop}>Stop</button>
                        ) : (
                            <button onClick={waitingToStartPom ? startPom : startBreak}>
                                Start {waitingToStartPom ? "Pom" : "Break"}
                            </button>
                        )}
                        <button onClick={backToTaskList}>Go To Task List</button>
                    </div>
                )
            }}
        </Subscribe>
    )
}

ActivePom.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    backToTaskList: PropTypes.func.isRequired
}

export default ActivePom
