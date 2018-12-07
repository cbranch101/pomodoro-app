import React from "react"
import PropTypes from "prop-types"
import styled from "react-emotion"
import TaskListItem from "./TaskListItem"
import TaskListData from "./TaskListData"

const List = styled("ul")`
    list-style: none;
`

class TaskList extends React.Component {
    state = {
        editedItemId: null
    }
    startCreatingNew = () => {
        this.setState({
            editedItemId: "new_item"
        })
    }
    startEditingItem = id => {
        this.setState({
            editedItemId: id
        })
    }
    stopEditingItem = () => {
        this.setState({
            editedItemId: null
        })
    }
    render() {
        return (
            <TaskListData
                render={({ tasks, updateTask, insertTask }) => {
                    const { startTask } = this.props
                    const { editedItemId } = this.state
                    const tasksWithNewItem =
                        editedItemId === "new_item"
                            ? [{ id: "new_item", estimatedPoms: 1, name: "Task Name" }, ...tasks]
                            : tasks
                    return (
                        <div>
                            <span>Task List</span>
                            <button onClick={this.startCreatingNew}>New</button>
                            <List>
                                {tasksWithNewItem.map(task => (
                                    <TaskListItem
                                        key={task.id}
                                        editing={task.id === this.state.editedItemId}
                                        startTask={startTask}
                                        edit={this.startEditingItem}
                                        canEdit={task.poms.length === 0}
                                        save={(id, fields) => {
                                            this.stopEditingItem()
                                            return id === "new_item"
                                                ? insertTask(fields)
                                                : updateTask(id, fields)
                                        }}
                                        task={task}
                                    />
                                ))}
                            </List>
                        </div>
                    )
                }}
            />
        )
    }
}

TaskList.propTypes = {
    startTask: PropTypes.func.isRequired
}

export default TaskList
