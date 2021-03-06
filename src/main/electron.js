const electron = require("electron")
const { app, ipcMain, Tray, nativeImage } = electron
const { autoUpdater } = require("electron-updater")
const isDev = require("electron-is-dev")
const path = require("path")
require("dotenv").config()
const { getMessageHandler } = require("./messages.js")
const TIMER_CHANNEL = "timer-message"
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let trayIcon

function createWindow() {
    // Check for software updates
    autoUpdater.checkForUpdates()
    // Create the browser window.
    mainWindow = new BrowserWindow({
        titleBarStyle: "hidden",
        width: 1281,
        height: 800,
        icon: path.join(__dirname, "../public/icons/png/64x64.png"),
        webPreferences: {
            webSecurity: false
        },
        show: false
    })

    const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS
    } = require("electron-devtools-installer")

    installExtension(REACT_DEVELOPER_TOOLS)
        .then(() => {
            mainWindow.webContents.openDevTools()
        })
        .catch(err => console.log("An error occurred: ", err))

    mainWindow.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
    )

    // React DevTools
    // installExtension(REACT_DEVELOPER_TOOLS)
    // .then(name => console.log(`Added Extension:  ${name}`))
    // .catch(err => console.log("An error occurred: ", err));

    let trayImage = nativeImage.createFromPath(path.join(__dirname, "/tray-icon.png"))

    trayImage = trayImage.resize({ width: 16, height: 16 })

    trayIcon = new Tray(trayImage)

    const messageHandler = getMessageHandler({
        trayIcon,
        sendResponse: contents => mainWindow.webContents.send(TIMER_CHANNEL, contents)
    })

    ipcMain.on(TIMER_CHANNEL, messageHandler)

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
        setTimeout(() => {
            mainWindow.webContents.send("test-message", "I'm updated")
        }, 3000)
    })

    // Prompt users before window close
    // mainWindow.on("close", e => {
    //   e.preventDefault();
    // });

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        mainWindow = null
    })
}

app.on("ready", createWindow)

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow()
    }
})

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = text => {
    if (mainWindow) {
        mainWindow.webContents.send("auto-update", text)
    }
}

autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Checking for update...")
})
autoUpdater.on("update-available", () => {
    sendStatusToWindow("Update available.")
})
autoUpdater.on("update-not-available", () => {
    sendStatusToWindow("Update not available.")
})
autoUpdater.on("error", err => {
    sendStatusToWindow(`Error in auto-updater: ${err.toString()}`)
})
autoUpdater.on("download-progress", progressObj => {
    sendStatusToWindow(
        `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${
            progressObj.transferred
        } + '/' + ${progressObj.total} + )`
    )
})
autoUpdater.on("update-downloaded", () => {
    sendStatusToWindow("Update downloaded; will install now")
})

autoUpdater.on("update-downloaded", () => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 500 ms.
    // You could call autoUpdater.quitAndInstall(); immediately
    autoUpdater.quitAndInstall()
})
