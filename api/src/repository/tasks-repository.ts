import path from "path"
import fs from "fs"
import { ITask } from "../interfaces/task"

const filePath = path.join(__dirname, '../data/tasks.json')
const caminho = __dirname + '/arquivo.json'

export const getAllTasks = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading tasks:', err)
                return reject(err)
            }
            
            try {
                const tasks = JSON.parse(data)
                resolve(tasks)
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
                reject(parseError)
            }
        })
    })
}

export const postTasks = async (tasks: ITask[]) => {

    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err)
        } else {
            console.log('Tasks saved successfully.')
        }
    })
}
