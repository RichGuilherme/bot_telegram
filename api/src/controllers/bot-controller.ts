
import { Request, Response } from "express"
import { handle } from "../services/handler"

export const botController = {
    getDataWebHook: async (req: Request, res: Response) => {
        try {
            res.send(await handle(req))
        } catch (error) {
            console.error('Erro ao listar eventos webhook:', error)      
        }
    }
}