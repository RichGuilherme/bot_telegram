import { Request, Response } from 'express'
import { calendarService } from '../services/calendar-service'
import { scheduleMessage } from "../services/schedule-service"
import { botService } from '../services/bot-service'


const googleTaskId = process.env.GOOGLE_TASK_ID as string

export const calendarController = {
    getTasks: async (req: Request, res: Response) => {
        try {
            const tasks = await calendarService.getTaskGoogle(googleTaskId)
            await scheduleMessage()
            await botService.handleChatBot()

            res.json(tasks)
        } catch (error) {
            console.error('Erro ao listar tasks:', error)
            res.status(500).send('Erro ao listar tasks')
        }
    }
}