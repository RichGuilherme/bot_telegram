import { botService } from "../services/bot-service"
import { Request, Response } from "express"

export const botController = {
    sendMessage: async (req: Request, res: Response) => {
        try {
            await botService.sendMessageBot()

            console.log("mensagem enviada")
            res.send("Mensagem enviada")

        } catch (error) {
            console.error('Erro:', error)
        }
    }
}