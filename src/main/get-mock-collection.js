import Chance from "chance"

const delayedReturn = output =>
    new Promise(resolve => {
        setTimeout(() => resolve(output), 1)
    })

const wrapMethod = func => (...args) => {
    const result = func(...args)
    return delayedReturn(result)
}

const getDataToSet = data => {
    if (!Array.isArray(data)) {
        return data
    }

    return data.reduce((dataToSet, item) => {
        return Object.assign({}, dataToSet, { [item.id]: item })
    }, {})
}

const getMockCollection = data => {
    const dbChance = new Chance("test")
    const getId = () => dbChance.guid()
    const store = getDataToSet(data)
    return {
        insert: wrapMethod(item => {
            const id = getId()
            const newItem = Object.assign({}, item, { id })
            store[id] = newItem
            return newItem
        }),
        update: wrapMethod((id, fields) => {
            const oldItem = store[id]
            const updatedItem = Object.assign({}, oldItem, fields)
            store[id] = updatedItem
            return updatedItem
        }),
        delete: wrapMethod(id => {
            const oldItem = store[id]
            delete store[id]
            return oldItem
        }),
        find: wrapMethod(getItems => {
            const baseItems = items => items
            const findItems = getItems || baseItems
            const itemArray = Object.keys(store).map(id => store[id])
            return findItems(itemArray)
        }),
        findById: wrapMethod(id => store[id])
    }
}

module.exports = {
    getMockCollection
}
