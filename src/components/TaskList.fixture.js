import TaskList from "./TaskList"

export default {
    component: TaskList,
    props: {
        navigate: path => console.log(`navigating to ${path}`)
    }
}
