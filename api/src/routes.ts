import { Router } from 'express'

import { authController } from './controllers/oauth2-controller'
import { authMiddleware } from './middleware/auth-middleware'
import { calendarController } from './controllers/calendar-controller'
import { botController } from './controllers/bot-controller'

const router = Router()

router.get('/auth', authController.login)
router.get('/redirect', authController.redirect)
router.get('/tasks', authMiddleware, calendarController.getTasks)

// Bot Telegram

router.get('/sendMessageBot', botController.sendMessage)

export default router