import { Request, Response } from 'express'
import { authService } from '../services/auth-service'

export const authController = {
    login: (req: Request, res: Response) => {
        const url = authService.generateAuthUrl()
        res.redirect(url)
    },

    redirect: async (req: Request, res: Response) => {
        const code = req.query.code as string

        try {

            await authService.getToken(code)
            res.send('Successfully logged in')
        } catch (err) {
            console.error('Couldn\'t get token', err)
            res.send('Error')
        }
    }
}