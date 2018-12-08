import React from "react"
import PropTypes from "prop-types"
import styled from "react-emotion"

const List = styled("ul")`
    list-style: none;
`

const TaskList = ({ tasks, onClickNew, renderItem }) => {
    return (
        <div>
            <span>Task List</span>
            <button onClick={onClickNew}>New</button>
            <List>{tasks.map(task => renderItem(task))}</List>
        </div>
    )
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    onClickNew: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired
}

export default TaskList
