import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Database from "../stateContainers/Database"
import Task from "../stateContainers/Task"

class TaskListData extends React.Component {
    render() {
        const { render } = this.props
        return (
            <Subscribe to={[Database]}>
                {database => {
                    const {
                        state: { tasks },
                        ...databaseMethods
                    } = database

                    if (tasks.loading) {
                        return <div>Loading</div>
                    }

                    return render({
                        tasks: tasks.data,
                        ...databaseMethods
                    })
                }}
            </Subscribe>
        )
    }
}

TaskListData.propTypes = {
    render: PropTypes.func.isRequired
}

export default TaskListData
