import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Database from "../stateContainers/Database"

class TaskListData extends React.Component {
    render() {
        const { render } = this.props
        return (
            <Subscribe to={[Database]}>
                {({ state: { tasks }, ...methods }) => {
                    if (tasks.loading) {
                        return <div>Loading</div>
                    }
                    return render({
                        tasks: tasks.data,
                        ...methods
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
