import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Timer from "../stateContainers/Timer"

const ActivePom = ({ navigate }) => {
    return (
        <Subscribe to={[Timer]}>
            {timer => {
                const { status } = timer.state
                const { startPom, startBreak, stop } = timer
                const waitingToStartPom = status === "WAITING_TO_START_POM"
                return (
                    <div>
                        <p>Current message {status}</p>
                        {status === "IN_POM" || status === "IN_BREAK" ? (
                            <button onClick={stop}>Stop</button>
                        ) : (
                            <button onClick={waitingToStartPom ? startPom : startBreak}>
                                Start {waitingToStartPom ? "Pom" : "Break"}
                            </button>
                        )}
                        <button onClick={() => navigate("taskList")}>Go To Task List</button>
                    </div>
                )
            }}
        </Subscribe>
    )
}

ActivePom.propTypes = {
    navigate: PropTypes.func.isRequired
}

export default ActivePom
