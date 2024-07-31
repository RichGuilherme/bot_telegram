import path from "path"
import fs from "fs"
import { ITask } from "../models/task"
import chalk from "chalk"

const filePath = path.join(process.cwd(), 'src/data/tasks.json')

const readTasksFromFile = (): Promise<ITask[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(chalk.redBright('Error na leitura do arquivo: %s'), err)
                return reject(err)
            }

            try {
                if (!data) {
                    console.warn(chalk.yellowBright('Arquivo JSON está vazio!'))
                    return resolve([])
                }

                const tasks = JSON.parse(data) as ITask[]
                resolve(tasks)
            } catch (parseError) {
                console.error(chalk.redBright('Error parsing JSON: %s'), parseError)
                reject(parseError)
            }
        })
    })
}

const writeTasksToFile = async (tasks: ITask[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error(chalk.redBright('Erro ao escrever no arquivo: %s'), err)
                return reject(err)
            }

            resolve()
        })
    })
}



const findClosestTask = (tasks: ITask[]): ITask[] => {
    const today = new Date()

    const sortedTasks = tasks.sort((a, b) => {
        const dateA = new Date(a.Day).getTime()
        const dateB = new Date(b.Day).getTime()

        return Math.abs(dateA - today.getTime()) - Math.abs(dateB - today.getTime())
    })

    return sortedTasks
}


export const tasksRepository = {
    getClosestTask: async (): Promise<ITask[]> => {
        const tasks = await readTasksFromFile()

        return findClosestTask(tasks)
    },

    deleteTasks: async (key: number): Promise<void> => {
        const tasks = await readTasksFromFile()
        const updatedTasks = tasks.filter(task => task.id !== key)
        await writeTasksToFile(updatedTasks)
    },

    postTask: async (tasks: ITask[]): Promise<void> => {
        await writeTasksToFile(tasks)
    }
}