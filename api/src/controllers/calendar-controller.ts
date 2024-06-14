import { Request, Response } from 'express'
import { calendarService } from '../services/calendar-service'

export const calendarController = {
    getEvents: async (req: Request, res: Response) => {
        try {
            const events = await calendarService.Tasks("MTMzNDQ2MDUzNTk0NzMxNzgwOTI6MDow")
            res.json(events)
        } catch (error) {
            console.error('Erro ao listar eventos:', error)
            res.status(500).send('Erro ao listar eventos')
        }
    }
}