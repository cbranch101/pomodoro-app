const { getMockCollection } = require("./get-mock-collection")

const collectionMap = {
    tasks: [
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
}

const getCollections = () => {
    return Object.keys(collectionMap).reduce((memo, collectionName) => {
        memo[collectionName] = getMockCollection(collectionMap[collectionName])
        return memo
    }, {})
}

const getMessageHandler = ({ sendResponse, collections }) => async (type, payload) => {
    const [collectionName, method] = type.split("__")
    const response = await collections[collectionName][method](...payload)
    sendResponse({
        name: "database",
        payload: {
            type,
            payload: response
        }
    })
}

module.exports = {
    getCollections,
    getMessageHandler
}
