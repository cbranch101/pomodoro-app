import { Container } from "unstated"
import moment from "moment"

class Database extends Container {
    api = null
    constructor(props) {
        super(props)
        this.api = props.api
        this.fetchTasks()
        this.fetchSummary()
        this.fetchCurrentDay()
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

    fetch = async (key, query = items => items, method = "find", storageKey) => {
        const finalStorageKey = storageKey || key
        this.modifyDataKey(finalStorageKey, { data: null, loading: true })
        const data = await this.sendMessage(key, method, query)
        this.modifyDataKey(finalStorageKey, { data, loading: false })
        return data
    }

    update = async (key, id, fields) => {
        const updatedItem = await this.sendMessage(key, "update", id, fields)
        this.modifyDataKey(key, state => {
            const updatedItems = state.data.map(item =>
                item.id === updatedItem.id
                    ? {
                        ...item,
                        ...updatedItem
                    }
                    : item
            )
            return {
                ...state,
                data: updatedItems
            }
        })
        return updatedItem
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
        return createdItem
    }

    addPomToTasks = newPom => {
        this.modifyDataKey("tasks", state => {
            const updatedTasks = state.data.map(task => {
                if (task.id !== newPom.taskId) {
                    return task
                }
                return {
                    ...task,
                    poms: [...task.poms, newPom]
                }
            })
            return {
                ...state,
                data: updatedTasks
            }
        })
    }
    filterToCurrentDay = days => {
        return days.filter(day => {
            return moment.unix(day.createdAt).diff(moment(), "days") === 0
        })
    }

    fetchTasks = () => this.fetch("tasks")
    fetchSummary = () => this.fetch("poms", undefined, "getSummary", "pomSummary")
    fetchCurrentDay = () => this.fetch("days", this.filterToCurrentDay)

    updateTask = (id, fields) => this.update("tasks", id, fields)
    insertTask = newItem => this.insert("tasks", newItem)
    insertDay = newItem => this.insert("days", newItem)

    state = {
        tasks: {
            data: null,
            loading: true
        }
    }
}

export default Database
