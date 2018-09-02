import React, { Component } from "react"
import { Provider, Subscribe } from "unstated"

import Router from "./stateContainers/Router"
import ActivePom from "./components/ActivePom"
import TaskList from "./components/TaskList"

class App extends Component {
    render() {
        return (
            <Provider>
                <Subscribe to={[Router]}>
                    {router => {
                        const { location } = router.state
                        if (location === "taskList") return <TaskList navigate={router.navigate} />
                        if (location === "activePom")
                            return <ActivePom navigate={router.navigate} />
                        return null
                    }}
                </Subscribe>
            </Provider>
        )
    }
}

export default App
