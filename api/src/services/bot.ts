import TelegramBot from "node-telegram-bot-api"
import { formatDate } from "../utils/formatDate"
import { ITask } from "../models/task"
import { TaskRepositories } from "../repository/tasks-repository"

const token = process.env.TOKEN_TELEGRAM as string
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHATBOT_ID as string

// const webhookUrl = 'https://YOUR_VERCEL_DEPLOYED_URL/api/telegram-bot'

// bot.setWebHook(webhookUrl)

export const sendMessageBot = async (name: string, day: Date, task: string): Promise<void> => {
    await bot.sendMessage(chatId, `No próximo culto dia ${formatDate(day)}, ficará na projeção <b>${name}</b> - <b>${task}</b>`, { parse_mode: "HTML" })
}

export const onChatBot = async () => {
    let tasks: ITask[] = await TaskRepositories.getClosestTask() as ITask[]

    bot.on('message', async (msg) => {
        let scale = "escala"
        if (msg.text?.toString().toLowerCase().indexOf(scale) === 0) {
            await bot.sendMessage(msg.chat.id, "Escala do mês:")

            tasks.forEach(task => {
                bot.sendMessage(msg.chat.id, `<b style="color: red">${task.Name}</b>: \nDia <b>${formatDate(task.Day)}</b> - <b>${task.Task}</b>`, { parse_mode: "HTML" })
            })
        }
    })
}

onChatBot() 