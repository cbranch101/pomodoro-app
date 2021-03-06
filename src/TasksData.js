import React from "react"

import { Subscribe } from "unstated"
import PropTypes from "prop-types"
import Database from "./stateContainers/Database"

class TasksData extends React.Component {
    render() {
        const { renderLoading = () => <div>Loading</div>, render } = this.props
        return (
            <Subscribe to={[Database]}>
                {database => {
                    const { tasks } = database.state
                    return tasks.loading
                        ? renderLoading()
                        : render({ tasks: tasks.data, fetchTasks: database.fetchTasks })
                }}
            </Subscribe>
        )
    }
}

TasksData.propTypes = {
    render: PropTypes.func.isRequired,
    renderLoading: PropTypes.func
}

export default TasksData
