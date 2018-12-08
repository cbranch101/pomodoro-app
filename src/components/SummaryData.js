import React from "react"

import { Subscribe } from "unstated"
import PropTypes from "prop-types"
import Database from "./stateContainers/Database"

class SummaryData extends React.Component {
    render() {
        const { renderLoading = () => <div>Loading</div>, render } = this.props
        return (
            <Subscribe to={[Database]}>
                {database => {
                    const { pomSummary } = database.state
                    return pomSummary.loading
                        ? renderLoading()
                        : render({ summary: pomSummary.data, fetchSummary: database.fetchSummary })
                }}
            </Subscribe>
        )
    }
}

SummaryData.propTypes = {
    render: PropTypes.func.isRequired,
    renderLoading: PropTypes.func
}

export default SummaryData
