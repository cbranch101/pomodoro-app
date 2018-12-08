import React from "react"
import SummaryData from "../SummaryData"

const Summary = () => {
    return (
        <SummaryData
            render={({ summary }) => {
                return (
                    <ul>
                        <li>Poms Completed Today: {summary.totalPoms}</li>
                    </ul>
                )
            }}
        />
    )
}

export default Summary
