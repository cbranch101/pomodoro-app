import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "unstated"
export default () => {
    class UnstatedProxy extends Component {
        render() {
            const { value: NextProxy, next } = this.props.nextProxy
            return (
                <Provider>
                    <NextProxy {...this.props} nextProxy={next()} />
                </Provider>
            )
        }
    }

    UnstatedProxy.propTypes = {
        nextProxy: PropTypes.object
    }

    return UnstatedProxy
}
