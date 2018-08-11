import React, { Component } from "react"
const { ipcRenderer } = window.require("electron")
import { createApi } from "./client-api"
import { Provider, Subscribe, Container } from "unstated"

class MainMessageContainer extends Container {
    constructor(props) {
        super(props)
        ipcRenderer.on("test-message", (event, message) => {
            this.setState({ message })
        })
    }

    state = {
        message: null
    }
}

class App extends Component {
    api = null
    componentWillMount = () => {
        const listenToChannel = onChannel =>
            ipcRenderer.on("db-message", (event, message) => onChannel(message))
        const sendMessage = message => ipcRenderer.send("db-message", message)
        this.api = createApi(listenToChannel, sendMessage)
    }
    handleClick = () => {
        this.api
            .sendMessage({
                name: "testQuery",
                payload: {
                    count: 5
                }
            })
            .then(response => console.log(response))
    }
    render() {
        return (
            <Provider>
                <Subscribe to={[MainMessageContainer]}>
                    {mainMessage => {
                        return (
                            <div className="App">
                                <header className="App-header">
                                    <h1 className="App-title">Welcome to React</h1>
                                </header>
                                <p className="App-intro">
                                    Current message {mainMessage.state.message}
                                </p>
                                <button onClick={this.handleClick}>Message</button>
                            </div>
                        )
                    }}
                </Subscribe>
            </Provider>
        )
    }
}

export default App
