import { Request, Response, NextFunction } from 'express'
import { oauth2Client } from '../services/auth-service'
import chalk from 'chalk'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = oauth2Client.credentials.access_token

    if (token) {
        next()
    } else {
        console.warn(chalk.yellowBright('Unauthorized'))
        res.redirect('/auth')
    }
}