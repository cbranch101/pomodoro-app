import { getTimerHandler } from "./timer.js"

describe("timer", () => {
    test("the on tick handler should be called on every tick", done => {
        const timerHandler = getTimerHandler((timerName, count) => {
            expect(timerName).toEqual("test-timer")
            expect(count).toEqual(1)
            done()
        })
        timerHandler.startFor("test-timer", 1)
    })
    test(
        "all timer should be stoppable, and it should " +
            "be possible to have multiple timers running at once",
        async () => {
            const timerHandler = getTimerHandler(() => {})
            setTimeout(() => {
                timerHandler.stop("stop")
            }, 1050)
            const returnValue = await Promise.all([
                timerHandler.startFor("stop", 2),
                timerHandler.startFor("finish", 2)
            ])
            expect(returnValue).toMatchSnapshot()
        }
    )
})
