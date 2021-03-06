import React from "react"
import PropTypes from "prop-types"
import Summary from "./Summary"
import TaskListData from "./TaskListData"
import TaskList from "./TaskList"
import TaskListItem from "./TaskListItem"
import ActivePom from "./ActivePom"

class TaskOverview extends React.Component {
    state = {
        editedTaskId: null
    }
    startCreatingNew = () => {
        this.setState({
            editedTaskId: "new_item"
        })
    }
    startEditingTask = id => {
        this.setState({
            editedTaskId: id
        })
    }
    stopEditingTask = () => {
        this.setState({
            editedTaskId: null
        })
    }
    render() {
        const { onClickStartTask, onClickBackToList, activeTaskId, renderSummary } = this.props
        return (
            <TaskListData
                render={({ tasks, insertTask, updateTask }) => {
                    const { editedTaskId } = this.state
                    const activeTask = activeTaskId && tasks.find(task => task.id === activeTaskId)
                    if (activeTask) {
                        return <ActivePom task={activeTask} backToTaskList={onClickBackToList} />
                    }

                    const tasksWithNewItem =
                        editedTaskId === "new_item"
                            ? [
                                {
                                    id: "new_item",
                                    estimatedPoms: 1,
                                    name: "Task Name",
                                    poms: [],
                                    completed: false
                                },
                                ...tasks
                            ]
                            : tasks
                    return (
                        <div>
                            {renderSummary()}
                            <TaskList
                                onClickNew={this.startCreatingNew}
                                tasks={tasksWithNewItem}
                                renderItem={task => {
                                    return (
                                        <TaskListItem
                                            key={task.id}
                                            editing={task.id === this.state.editedTaskId}
                                            startTask={onClickStartTask}
                                            edit={this.startEditingTask}
                                            canEdit={task.poms.length === 0}
                                            canStart={
                                                task.completed === false &&
                                                task.id !== this.state.editedItemId
                                            }
                                            save={(id, fields) => {
                                                this.stopEditingTask()
                                                return id === "new_item"
                                                    ? insertTask(fields)
                                                    : updateTask(id, fields)
                                            }}
                                            task={task}
                                        />
                                    )
                                }}
                            />
                        </div>
                    )
                }}
            />
        )
    }
}

TaskOverview.propTypes = {
    onClickStartTask: PropTypes.func.isRequired,
    onClickBackToList: PropTypes.func.isRequired,
    activeTaskId: PropTypes.string
}

export default TaskOverview
