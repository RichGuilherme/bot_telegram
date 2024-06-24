import { Router } from 'express'
import { authController } from './controllers/oauth2-controller'
import { authMiddleware } from './middleware/auth-middleware'
import { calendarController } from './controllers/calendar-controller'
import { botScheduleController } from './controllers/botSchedule-controller'
import { botController } from './controllers/bot-controller'

const router = Router()

const token = process.env.TOKEN_TELEGRAM as string
const weebhookEnd = "/webhook/" + token

router.get('/auth', authController.login)
router.get('/redirect', authController.redirect)
router.get('/tasks', authMiddleware, calendarController.getTasks)

// Bot Telegram

router.get('/sendMessageBot', botScheduleController.sendMessage)

router.post(weebhookEnd, botController.getDataWebHook)



export default router