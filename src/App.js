import React, { Component } from "react"
import { Provider, Subscribe } from "unstated"
import Timer from "./stateContainers/Timer"

class App extends Component {
    render() {
        return (
            <Provider>
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
                            </div>
                        )
                    }}
                </Subscribe>
            </Provider>
        )
    }
}

export default App
