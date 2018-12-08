import React from "react"
import PropTypes from "prop-types"

const InBreak = ({ onClickStop }) => {
    return (
        <div>
            <button onClick={onClickStop}>Stop Break</button>
        </div>
    )
}

InBreak.propTypes = {
    onClickStop: PropTypes.func.isRequired
}

export default InBreak
