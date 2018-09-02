import { Container } from "unstated"
import getMockCollection from "../get-mock-collection"

const tasks = [
    {
        id: "one",
        name: "Build this app",
        estimatedPoms: 3,
        completed: false
    }
]
const api = {
    tasks: getMockCollection(tasks)
}

class Database extends Container {
    api = null
    constructor(props) {
        super(props)
        this.api = api
    }

    modifyDataKey = (key, reducer) => {
        this.setState(state => {
            const newValue = typeof reducer === "function" ? reducer(state[key]) : reducer
            return {
                ...state,
                [key]: newValue
            }
        })
    }

    fetch = async (key, query = items => items) => {
        this.modifyDataKey(key, { data: null, loading: true })
        const data = await api[key].find(query)
        this.modifyDataKey(key, { data, loading: false })
    }

    fetchTasks = () => this.fetch("tasks")

    state = {
        tasks: {
            data: null,
            loading: true
        }
    }
}

export default Database
