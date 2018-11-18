import React, { Component } from "react"
import { Subscribe } from "unstated"

import ActivePom from "./components/ActivePom"
import Task from "./stateContainers/Task"
import TaskList from "./components/TaskList"
import TaskListData from "./components/TaskListData"

class App extends Component {
    render() {
        return (
            <TaskListData
                render={({ tasks, updateTask, insertTask }) => {
                    return (
                        <Subscribe to={[Task]}>
                            {task => {
                                const {
                                    startWorking: startTask,
                                    stopWorking,
                                    state: { workedOnTask }
                                } = task
                                if (workedOnTask) {
                                    const task = tasks.find(task => task.id === workedOnTask)
                                    return <ActivePom task={task} backToTaskList={stopWorking} />
                                }
                                return (
                                    <TaskList
                                        startTask={startTask}
                                        tasks={tasks}
                                        updateTask={updateTask}
                                        insertTask={insertTask}
                                    />
                                )
                            }}
                        </Subscribe>
                    )
                }}
            />
        )
    }
}

export default App
