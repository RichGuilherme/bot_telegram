import TelegramBot from "node-telegram-bot-api"

const token = process.env.TOKEN_TELEGRAM || ""

const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHATBOT_ID as string


export const botService = {
    sendMessageBot: async () => {
        await bot.sendMessage(chatId, `Hj dia ${new Date()} ficará na projeção Richard`)
    }
}