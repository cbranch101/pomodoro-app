import { testFunction } from "./test-file"

test("test file test", async () => {
    const val = await testFunction()
    expect(val).toEqual("foo")
})
