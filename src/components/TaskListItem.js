import React from "react"
import styled from "react-emotion"
import PropTypes from "prop-types"

const ListItem = styled("li")`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`

const Description = styled("div")`
    flex: 2 1 auto;
`

const EstimateSection = styled("span")`
    flex: 1 1 auto;
`

const EstimateValue = styled("span")`
    margin-right: 15px;
    margin-left: 15px;
`

const ActionButton = styled("button")`
    flex: 1 1 auto;
`

class TaskListItem extends React.Component {
    state = {
        editedTask: {}
    }
    unmounting = false

    componentWillUnmount() {
        this.unmounting = true
    }

    updateEditedTask = (key, value) => {
        const currentValue = this.state.editedTask[key] || this.props.task[key]
        this.setState(state => ({
            ...state,
            editedTask: {
                ...state.editedTask,
                [key]: typeof value === "function" ? value(currentValue) : value
            }
        }))
    }
    handleSave = async () => {
        await this.props.save(this.props.task.id, {
            ...this.props.task,
            ...this.state.editedTask
        })
        if (!this.unmounting) {
            this.setState({
                editedTask: {}
            })
        }
    }

    render() {
        const { task: baseTask, edit, editing } = this.props
        const task = {
            ...baseTask,
            ...this.state.editedTask
        }
        const { estimatedPoms, name } = task
        return (
            <ListItem>
                <Description>
                    {editing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={e => {
                                this.updateEditedTask("name", e.target.value)
                            }}
                        />
                    ) : (
                        task.name
                    )}
                </Description>
                <EstimateSection>
                    {editing && (
                        <button
                            disabled={estimatedPoms === 1}
                            onClick={() =>
                                this.updateEditedTask("estimatedPoms", value => value - 1)
                            }
                        >
                            -
                        </button>
                    )}
                    <EstimateValue>{estimatedPoms}</EstimateValue>
                    {editing && (
                        <button
                            disabled={estimatedPoms === 10}
                            onClick={() =>
                                this.updateEditedTask("estimatedPoms", value => value + 1)
                            }
                        >
                            +
                        </button>
                    )}
                </EstimateSection>
                <ActionButton onClick={() => (editing ? this.handleSave() : edit(task.id))}>
                    {editing ? "Save" : "Edit"}
                </ActionButton>
                <ActionButton>Start</ActionButton>
            </ListItem>
        )
    }
}

TaskListItem.propTypes = {
    edit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        estimatedPoms: PropTypes.number.isRequired
    })
}

export default TaskListItem
