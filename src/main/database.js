const { getMockCollection } = require("./get-mock-collection")
const moment = require("moment")

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
            createdAt: moment()
                .subtract(4, "hours")
                .unix(),
            duration: 100,
            completed: false
        },
        {
            id: "two",
            taskId: "two",
            createdAt: moment()
                .subtract(5, "hours")
                .unix(),
            duration: 100,
            completed: false
        },
        {
            id: "three",
            taskId: "two",
            createdAt: moment()
                .subtract(2, "days")
                .unix(),
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
    poms: {
        getSummary: async (undefined, collections) => {
            const poms = await collections.poms.find()
            const pomsForToday = poms.filter(pom => {
                return moment().diff(moment.unix(pom.createdAt), "days") === 0
            })
            const summaryForToday = pomsForToday.reduce(
                (memo, pom) => {
                    memo.totalDuration += pom.duration
                    return memo
                },
                { totalDuration: 0 }
            )
            return Object.assign({}, summaryForToday, {
                totalPoms: pomsForToday.length
            })
        }
    }
}

const getMessageHandler = ({ sendResponse, collections }) => async (type, payload) => {
    const [collectionName, method] = type.split("__")
    const collectionMethod = collections[collectionName][method]
    const responsePromise = collectionMethod
        ? collections[collectionName][method](...payload)
        : Promise.resolve(undefined)
    const response = await responsePromise
    const updater = processMap[collectionName][method] || (() => Promise.resolve(response))
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
