import { google } from 'googleapis'
import { oauth2Client } from './auth-service'
import { tasksRepository } from '../repository/tasks-repository'
import { ITask } from '../models/task'


const service = google.tasks({
    version: 'v1',
    auth: oauth2Client
})

export const googleTaskService = {
    getTaskGoogle: async (taskListId: string): Promise<ITask[] | null> => {

        const res = await service.tasks.list({
            tasklist: taskListId,
        })

        const taskLists = res.data.items

        // Pegar apenas tarefas desse mês
        if (taskLists && taskLists.length) {
            const currentDate = new Date()
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

            const tasks = taskLists.filter((taskValue) => {
                const taskDate = taskValue.due ? new Date(taskValue.due.split("T")[0]) : null

                return taskDate && taskDate >= firstDayOfMonth && taskDate <= lastDayOfMonth
            })
                .map((taskValue, index) => ({
                    id: index,
                    Name: taskValue.title || "",
                    Task: taskValue.notes || "",
                    Day: new Date(taskValue.due as string)
                })) as ITask[]

            tasksRepository.postTask(tasks)

            return tasks
        } else {

            return null
        }
    },
}