import { Request, Response } from 'express'
import { calendarService } from '../services/calendar-service'

const googleTaskId = process.env.GOOGLE_TASK_ID as string

export const calendarController = {
    getEvents: async (req: Request, res: Response) => {
        try {
            const events = await calendarService.Tasks(googleTaskId)
            res.json(events)
        } catch (error) {
            console.error('Erro ao listar eventos:', error)
            res.status(500).send('Erro ao listar eventos')
        }
    }
}