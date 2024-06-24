import { handle } from "./handler"
import { Request, Response } from "express"

export const botController = {
    getDataWebHook: async (req: Request, res: Response) => {
        try {
            res.send(await handle(req))
        } catch (error) {
            console.error('Erro ao listar eventos:', error)
            
        }
    }
}