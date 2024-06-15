import "../services/bot-service"
import { Request, Response } from "express"

export const botController = {
    sendMessage: async (req: Request, res: Response) => {
        try {
            res.send("Bot On")

        } catch (error) {
            console.error('Erro:', error)
        }
    }
}
