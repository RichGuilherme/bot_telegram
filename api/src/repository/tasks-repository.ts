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

const deleteTasks = async (key: number) => {
    return new Promise<void>((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo:', err)
                return reject(err)
            }
            
            let jsonData: ITask[]

            try {
                jsonData = JSON.parse(data)
            } catch (err) {
                console.error('Erro ao parsear o JSON:', err)
                return reject(err)
            }

            const index = jsonData.findIndex(item => item.id === key)
            
            jsonData.splice(index, 1)

            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Erro ao escrever no arquivo:', err)
                    return reject(err)
                }

                console.log('Dado deletado com sucesso!')
                resolve()
            })
        })
    })
}

const postTasks = async (tasks: ITask[]) => {
    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err)
        } else {
            console.log('Tarefa salva com sucesso!.')
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
    deleteTasks,
    postTasks,
}