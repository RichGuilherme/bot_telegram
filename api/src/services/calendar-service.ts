import { google } from 'googleapis'
import { oauth2Client } from './auth-service'
import { formatDate } from '../utils/formatDate'
import { TaskRepositories } from '../repository/tasks-repository'


export const calendarService = {
    Tasks: async (taskListId: string) => {
        const service = google.tasks({
            version: 'v1',
            auth: oauth2Client
        })

        const res = await service.tasks.list({
            tasklist: taskListId,
        })

        const taskLists = res.data.items

        if (taskLists && taskLists.length) {
            const currentDate = new Date()
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

            const tasks = taskLists.filter((taskValue) => {
                const taskDate = taskValue.due ? new Date(taskValue.due.split("T")[0]) : null

                return taskDate && taskDate >= firstDayOfMonth && taskDate <= lastDayOfMonth
            }).map((taskValue, index) => ({
                id: index,
                Name: taskValue.title || "",
                Task: taskValue.notes || "",
                Day: formatDate(taskValue.due?.split("T")[0] as string),
            }))

            TaskRepositories.postTasks(tasks)

        } else {
            console.log('No task lists found.')
        }
    },
}