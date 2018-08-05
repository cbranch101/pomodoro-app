const testPromise = new Promise(resolve => {
    setTimeout(() => resolve("foo"), 10)
})

const testFunction = async () => {
    const value = await testPromise
    console.log(value)
    return value
}

module.exports = {
    testFunction
}
