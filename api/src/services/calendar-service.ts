import { google } from 'googleapis'
import { oauth2Client } from './auth-service'
import fs from 'fs'
import path from 'path'

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
            }).map((taskValue) => ({
                Nome: taskValue.title || "",
                Tarefa: taskValue.notes || "",
                Dia: taskValue.due?.split("T")[0]
            }))

            const filePath = path.join(__dirname, '../data/tasks.json')

            fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err)
                } else {
                    console.log('Tasks saved successfully.')
                }
            })

        } else {
            console.log('No task lists found.')
        }
    },
}