import React from "react"
import ReactDOM from "react-dom"
// import { loadDatabase } from "./api"

import App from "./App"

// const testDatabase = async () => {
//     const db = await loadDatabase()
//     const records = await db.find({})
//     console.log(records)
// }

// setTimeout(() => {
//     console.log("sending message")
//     ipcRenderer.send("render-message", { render: "message" })
// }, 3000)

// testDatabase()
ReactDOM.render(<App />, document.getElementById("root"))
