import path from "path"
import fs from "fs"
import { ITask } from "../interfaces/task"
import { toDate } from "../utils/toDate"

const filePath = path.join(__dirname, '../data/tasks.json')

const getClosetsTask = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading tasks:', err)
                return reject(err)
            }

            try {
                if (!data) {
                    console.warn('JSON file is empty')
                    return resolve(null)
                }

                const tasks = JSON.parse(data)
                
                const closetsTask = findClosetsTask(tasks)
                resolve(closetsTask)
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
                reject(parseError)
            }
        })
    })
}

const postTasks = async (tasks: ITask[]) => {
    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err)
        } else {
            console.log('Tasks saved successfully.')
        }
    })
}



const findClosetsTask = (tasks: ITask[]): ITask | null => {
    const today = new Date()

    const sortedTasks = tasks.sort((a, b) => {
        const dateA = toDate(a.Day).getTime()
        const dateB = toDate(b.Day).getTime()

        return Math.abs(dateA - today.getTime()) - Math.abs(dateB - today.getTime())
    })

    return sortedTasks.length > 0 ? sortedTasks[0] : null // Primeira tarefa da lista
}

export const TaskRepositories = {
    getClosetsTask,
    postTasks,
}