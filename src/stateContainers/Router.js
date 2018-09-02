import { Container } from "unstated"

class Router extends Container {
    navigate = location => this.setState({ location })

    state = {
        location: "taskList"
    }
}

export default Router
