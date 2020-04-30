const { getMockCollection } = require("./get-mock-collection")
const moment = require("moment")

const collectionMap = {
    sessions: [
        {
            id: "one",
            createdAt: moment()
                .subtract(1, "hours")
                .unix(),
            type: "untracked",
            duration: 500
        },
        {
            id: "two",
            createdAt: moment()
                .subtract(1, "hours")
                .unix(),
            type: "planning",
            duration: 500
        }
    ],
    days: [
        {
            id: "one",
            createdAt: moment()
                .subtract(1, "hours")
                .unix(),
            isActive: false,
            stoppedAt: moment()
                .subtract(1, "days")
                .add(2, "hours")
                .unix()
        }
    ],
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

const filterForToday = items => {
    return items.filter(item => {
        return moment().diff(moment.unix(item.createdAt), "days") === 0
    })
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
        getSummary: async (repsonse, collections) => {
            const [poms, sessions] = await Promise.all([
                collections.poms.find(),
                collections.sessions.find()
            ])

            const pomsForToday = filterForToday(poms)
            const sessionsForToday = filterForToday(sessions)
            const sessionSummaryForToday = sessionsForToday.reduce(
                (memo, session) => {
                    memo[`${session.type}Time`] += session.duration
                    return memo
                },
                {
                    planningTime: 0,
                    untrackedTime: 0
                }
            )
            const pomSummaryForToday = pomsForToday.reduce(
                (memo, pom) => {
                    memo.totalDuration += pom.duration
                    return memo
                },
                { totalDuration: 0 }
            )
            return Object.assign({}, pomSummaryForToday, sessionSummaryForToday, {
                totalPoms: pomsForToday.length
            })
        }
    },
    days: {}
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
