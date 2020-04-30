import React from "react"
import PropTypes from "prop-types"
import SummaryData from "./SummaryData"

const Summary = () => {
    return (
        <SummaryData
            render={({ summary }) => {
                return (
                    <ul>
                        <li>Poms Completed Today: {summary.totalPoms}</li>
                        <li>Untracked Time: {summary.untrackedTime}</li>
                        <li>Planning Time: {summary.planningTime}</li>
                    </ul>
                )
            }}
        />
    )
}

Summary.propTypes = {}

export default Summary
