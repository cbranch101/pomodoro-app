import React from "react"
import TaskOverview from "./TaskOverview"
import withData from "./withData"
import StartDay from "./StartDay"
import Summary from "./Summary"
import moment from "moment"

const WorkDayData = withData({
    storageKey: "days",
    mapData: days => ({
        currentDay: days[0]
    })
})

class WorkDay extends React.Component {
    state = {
        activeTaskId: null
    }
    startWorking = taskId => {
        this.setState({ activeTaskId: taskId })
    }
    stopWorking = () => {
        this.setState({ activeTaskId: null })
    }
    handleStartDay = ({ insertDay }) => () => {
        insertDay({
            createdAt: moment.unix(),
            active: true
        })
    }
    render() {
        return (
            <WorkDayData
                render={dataProps => {
                    const { currentDay } = dataProps
                    if (!currentDay) {
                        return <StartDay onClickStart={this.handleStartDay(dataProps)} />
                    }
                    return (
                        <TaskOverview
                            renderSummary={() => {
                                const { untrackedTime = 0, planningTime = 0 } = currentDay
                                return (
                                    <Summary
                                        untrackedTime={untrackedTime}
                                        planningTime={planningTime}
                                    />
                                )
                            }}
                            activeTaskId={this.state.activeTaskId}
                            onClickBackToList={this.stopWorking}
                            onClickStartTask={this.startWorking}
                        />
                    )
                }}
            />
        )
    }
}

export default WorkDay
