import React from "react"
import PropTypes from "prop-types"

const TaskOverview = ({ renderSummary, renderTaskList }) => {
    return (
        <div>
            {renderSummary()}
            {renderTaskList()}
        </div>
    )
}

TaskOverview.propTypes = {
    renderTaskList: PropTypes.func.isRequired,
    renderSummary: PropTypes.func.siRequired
}

export default TaskOverview
