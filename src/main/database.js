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
    ],
    poms: [
        {
            id: "one",
            taskId: "two",
            duration: 100,
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

const processMap = {
    tasks: {
        find: async (tasks, collections) => {
            return await Promise.all(
                tasks.map(task => {
                    const getTasks = async () => {
                        const pomsForTask = await collections.poms.find(poms =>
                            poms.filter(pom => pom.taskId === task.id)
                        )
                        return Object.assign({}, task, {
                            poms: pomsForTask
                        })
                    }
                    return getTasks()
                })
            )
        }
    },
    poms: {}
}

const getMessageHandler = ({ sendResponse, collections }) => async (type, payload) => {
    const [collectionName, method] = type.split("__")
    const response = await collections[collectionName][method](...payload)
    const updater = processMap[collectionName][method] || Promise.resolve(response)
    const updatedResponse = await updater(response, collections)
    sendResponse({
        name: "database",
        payload: {
            type,
            payload: updatedResponse
        }
    })
}

module.exports = {
    getCollections,
    getMessageHandler
}
