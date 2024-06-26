
import { Request, Response } from "express"
import { scheduleMessage } from "../services/schedule-service"

export const botScheduleController = {
    sendMessage: async (req: Request, res: Response) => {
        try {
            await scheduleMessage()
            res.send("Bot On")
        } catch (error) {
            console.error('Erro:', error)
        }
    }
}
