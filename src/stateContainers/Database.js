import { Container } from "unstated"

class Database extends Container {
    api = null
    constructor(props) {
        super(props)
        this.api = props.api
        this.fetchTasks()
    }

    sendMessage = async (key, method, ...args) => {
        const type = `${key}__${method}`
        const response = await this.api.sendMessage({
            name: "database",
            payload: {
                type,
                payload: args
            }
        })
        return response.payload
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
        const data = await this.sendMessage(key, "find", query)
        this.modifyDataKey(key, { data, loading: false })
    }

    update = async (key, id, fields) => {
        const updatedItem = await this.sendMessage(key, "update", id, fields)
        this.modifyDataKey(key, state => {
            const updatedItems = state.data.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
            return {
                ...state,
                data: updatedItems
            }
        })
    }

    insert = async (key, newItem) => {
        const createdItem = await this.sendMessage(key, "insert", newItem)
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
