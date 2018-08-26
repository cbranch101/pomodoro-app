const stringPadLeft = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length)
}

const getTimeString = seconds => {
    const minutes = Math.floor(seconds / 60)
    const baseSeconds = minutes * 60
    const secondsInMinute = seconds - baseSeconds
    return `${stringPadLeft(minutes, "0", 2)}:${stringPadLeft(secondsInMinute, "0", 2)}`
}

const updateTrayIconWithSecondsRemaining = (trayIcon, remainingSeconds) => {
    trayIcon.setTitle(getTimeString(remainingSeconds))
}

const emptyTrayIcon = trayIcon => {
    trayIcon.setTitle("")
}

module.exports = {
    updateTrayIconWithSecondsRemaining,
    emptyTrayIcon
}
