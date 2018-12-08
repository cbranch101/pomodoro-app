import Timer from "./stateContainers/Timer"
import Database from "./stateContainers/Database"

export default api => {
    const database = new Database({
        api
    })
    const timer = new Timer({
        api
    })

    return [timer, database]
}
