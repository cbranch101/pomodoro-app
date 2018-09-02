import React from "react"
import PropTypes from "prop-types"

const TaskList = ({ navigate }) => {
    return (
        <div>
            <span>Task List</span>
            <button onClick={() => navigate("activePom")}>Go To Button</button>
        </div>
    )
}

TaskList.propTypes = {
    navigate: PropTypes.func.isRequired
}

export default TaskList
