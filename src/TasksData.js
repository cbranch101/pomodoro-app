import React from "react"

import { Subscribe } from "unstated"
import PropTypes from "prop-types"
import Database from "./stateContainers/Database"

class TasksData extends React.Component {
    fetch = null
    componentDidMount = () => {
        this.fetch()
    }
    render() {
        const { renderLoading = () => <div>Loading</div>, render } = this.props
        return (
            <Subscribe to={[Database]}>
                {database => {
                    this.fetch = database.fetchTasks
                    const { tasks } = database.state
                    return tasks.loading ? renderLoading() : render({ tasks: tasks.data })
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
