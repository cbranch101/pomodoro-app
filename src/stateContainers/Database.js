import { Container } from "unstated"
import getMockCollection from "../get-mock-collection"

const tasks = [
    {
        id: "one",
        name: "Build this app",
        estimatedPoms: 3,
        completed: false
    },
    {
        id: "two",
        name: "A Second one",
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
        this.fetchTasks()
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

    update = async (key, id, fields) => {
        const updatedItem = await api[key].update(id, fields)
        this.modifyDataKey(key, state => {
            const updatedItems = state.data.map(
                item => (item.id === updatedItem.id ? updatedItem : item)
            )
            return {
                ...state,
                data: updatedItems
            }
        })
    }

    insert = async (key, newItem) => {
        const createdItem = await api[key].insert(newItem)
        this.modifyDataKey(key, state => {
            const updatedItems = [createdItem, ...state.data]
            return {
                ...state,
                data: updatedItems
            }
        })
    }

    fetchTasks = () => this.fetch("tasks")
    updateTask = (id, fields) => this.update("tasks", id, fields)
    insertTask = newItem => this.insert("tasks", newItem)

    state = {
        tasks: {
            data: null,
            loading: true
        }
    }
}

export default Database
