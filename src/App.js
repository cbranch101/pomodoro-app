import React, { Component } from "react"
const { ipcRenderer } = window.require("electron")
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
                            </div>
                        )
                    }}
                </Subscribe>
            </Provider>
        )
    }
}

export default App
