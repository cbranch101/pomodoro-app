import DataStore from "nedb-promise"

export const loadDatabase = async () => {
    const db = new DataStore("timers")
    await db.loadDatabase()
    return db
}
