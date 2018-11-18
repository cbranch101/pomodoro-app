import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "unstated"
import Timer from "../stateContainers/Timer"
import { getMessageHandler } from "../main/messages"
import { createApi } from "../render-main-api"

export default () => {
    class UnstatedProxy extends Component {
        api = null
        constructor(props) {
            super(props)

            const getMockListener = () => {
                let onChannel
                return {
                    start: newOnChannel => {
                        onChannel = newOnChannel
                    },
                    on: message => onChannel(message)
                }
            }

            const mockListener = getMockListener()
            const messageHandler = getMessageHandler({
                trayIcon: {
                    setTitle: value => console.log(`setting title to ${value}`)
                },
                sendResponse: mockListener.on
            })
            this.api = createApi(mockListener.start, message => messageHandler(null, message))
        }
        render() {
            const { value: NextProxy, next } = this.props.nextProxy
            const timer = new Timer({ api: this.api })
            return (
                <Provider inject={[timer]}>
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
