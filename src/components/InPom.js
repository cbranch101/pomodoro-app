import React from "react"
import PropTypes from "prop-types"

const InPom = ({ onClickStop }) => {
    return (
        <div>
            <button onClick={onClickStop}>Stop Pom</button>
        </div>
    )
}

InPom.propTypes = {
    onClickStop: PropTypes.func.isRequired
}

export default InPom
