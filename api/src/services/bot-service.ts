import TelegramBot from "node-telegram-bot-api";

const token = process.env.TOKEN_TELEGRAM || "";

const bot = new TelegramBot(token, { polling: true });
const chatId = -4277539222;


export const botService = {
    sendMessageBot: async () => {
        await bot.sendMessage(chatId, `Hj dia ${new Date()} ficará na projeção Richard`)
    }
}