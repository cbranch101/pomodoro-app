import Timer from "./stateContainers/Timer"
import Database from "./stateContainers/Database"

export default api => {
    const timer = new Timer({
        api
    })

    const database = new Database({
        api
    })

    return [timer, database]
}
