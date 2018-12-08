import React from "react"
import PropTypes from "prop-types"

const PrePom = ({ onClickStart, onClickBack }) => {
    return (
        <div>
            <button onClick={onClickStart}>Start Pom</button>
            <button onClick={onClickBack}>Back To List</button>
        </div>
    )
}

PrePom.propTypes = {
    onClickStart: PropTypes.func.isRequired,
    onClickBack: PropTypes.func.isRequired
}

export default PrePom
