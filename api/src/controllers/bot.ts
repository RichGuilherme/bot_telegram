import TelegramBot from "node-telegram-bot-api"
import { formatDate } from "../utils/formatDate"

const token = process.env.TOKEN_TELEGRAM as string
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHATBOT_ID as string

export const sendMessageBot = async (name: string, day: Date, task: string): Promise<void> => {
    await bot.sendMessage(chatId, `No próximo culto dia ${formatDate(day)}, ficará na projeção ${name} - ${task}`)
}
