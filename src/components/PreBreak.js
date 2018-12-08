import React from "react"
import PropTypes from "prop-types"

const PreBreak = ({ onClickCompleted, onClickStillWorking }) => {
    return (
        <div>
            <button onClick={onClickCompleted}>Completed</button>
            <button onClick={onClickStillWorking}>Still Working</button>
        </div>
    )
}

PreBreak.propTypes = {
    onClickCompleted: PropTypes.func.isRequired,
    onClickStillWorking: PropTypes.func.isRequired
}

export default PreBreak
