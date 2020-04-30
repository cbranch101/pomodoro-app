import React from "react"
import PropTypes from "prop-types"
import { Subscribe } from "unstated"
import Database from "../stateContainers/Database"

export default ({ storageKey, isLoading = () => false, mapData }) => {
    class DataFetcher extends React.Component {
        render() {
            const baseMapData = items => ({
                [storageKey]: items
            })
            const { render } = this.props
            const mapDataFinal = mapData || baseMapData
            return (
                <Subscribe to={[Database]}>
                    {database => {
                        const { state, ...databaseMethods } = database
                        const items = state[storageKey]

                        if (!items || items.loading || isLoading(items.data)) {
                            return <div>Loading</div>
                        }

                        return render({
                            ...databaseMethods,
                            ...mapDataFinal(items.data)
                        })
                    }}
                </Subscribe>
            )
        }
    }

    DataFetcher.propTypes = {
        render: PropTypes.func.isRequired
    }
    return DataFetcher
}
