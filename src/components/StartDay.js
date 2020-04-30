import React from "react"
import PropTypes from "prop-types"

const StartDay = ({ onClickStart }) => {
    return <button onClick={onClickStart}>Start Day</button>
}

StartDay.propTypes = {
    onClickStart: PropTypes.func.isRequired
}

export default StartDay
