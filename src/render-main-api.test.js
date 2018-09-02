import { createApi } from "./render-main-api"

const getMessageHandler = () => {
    let onChannel
    const sendMessageToClient = message => {
        onChannel(message)
    }
    const listen = newOnChannel => {
        onChannel = newOnChannel
    }
    return {
        sendMessageToClient,
        listen
    }
}

const messageHandler = getMessageHandler()

describe("renderMainApi", () => {
    test("should generate a promise based on the channel", done => {
        const sendMessageToMain = jest.fn()
        const api = createApi(messageHandler.listen, sendMessageToMain)
        const responseOne = { name: "messageOne", payload: { message: "one" } }
        const responseTwo = { name: "messageTwo", payload: { message: "two" } }
        api.sendMessage({ name: "messageOne", payload: { test: "one" } }).then(response => {
            expect(response).toEqual(responseOne.payload)
        })
        api.sendMessage({ name: "messageTwo", payload: { test: "two" } }).then(response => {
            expect(response).toEqual(responseTwo.payload)
            setTimeout(() => done(), 1)
        })
        messageHandler.sendMessageToClient(responseOne)
        messageHandler.sendMessageToClient(responseTwo)
    })
})
