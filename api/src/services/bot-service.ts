import TelegramBot, { ChatId, Message } from "node-telegram-bot-api"
import { formatDate } from "../utils/formatDate"
import { ITask } from "../models/task"

import https from 'https'
import { tasksRepository } from "../repository/tasks-repository"

const token = process.env.TOKEN_TELEGRAM as string
const url = process.env.URL_NGROK
const bot = new TelegramBot(token, { webHook: true })

var chatIDSchedule: number;


export const botService = {
    botInitWebhook: async (): Promise<string> => {
        const webhookUrl = `${url}/webhook/${token}`
        const apiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`

        return new Promise((resolve, reject) => {
            https.get(apiUrl, (res) => {
                let data = ''

                res.on('data', (value) => {
                    data += value
                })

                res.on('end', () => {
                    console.log('Webhook set:', data)
                    resolve(data)
                })
            }).on('error', (err) => {
                console.error('Error setting webhook:', err)
                reject(err)
            })
        })
    },

    sendMessageBot: async (name: string, day: Date, task: string): Promise<void> => {
        if (!chatIDSchedule) {
            chatIDSchedule = Number(process.env.CHATBOT_ID)
        }

        await bot.sendMessage(chatIDSchedule, `No próximo culto dia ${formatDate(day)}, ficará na projeção <b>${name}</b> - <b>${task}</b>`, { parse_mode: "HTML" })
    },

    handleChatBot: async (messageObj?: Message) => {
        let tasks: ITask[] = await tasksRepository.getClosestTask() as ITask[]
        let messageText = messageObj?.text || ""
        let chatID: ChatId = messageObj?.chat?.id as number


        if (messageText.charAt(0) === "/") {
            const command = messageText.slice(1)

            switch (command) {
                case "escala":
                    if (tasks.length === 0) {
                        await bot.sendMessage(chatID, `Escala não criada ou vazia!`)
                        break;
                    } else {

                        await bot.sendMessage(chatID, "Escala do mês:")
                        for (const task of tasks) {
                            await bot.sendMessage(chatID, `<b>${task.Name}</b>: \nDia <b>${formatDate(task.Day)}</b> - <b>${task.Task}</b>`, { parse_mode: "HTML" })
                        }
                        break;
                    }


                case "configSchedule":
                    chatIDSchedule = chatID;
                    await bot.sendMessage(chatID, `O chat com agendamento foi definido: ${chatID}`)
                    break;

                case "proxCulto":
                    if (tasks.length === 0) {
                        await bot.sendMessage(chatID, `Escala não criada ou vazia!`)
                        break;
                        
                    } else {
                        await bot.sendMessage(chatID, `Proximo culto dia <b>${formatDate(tasks[0].Day)}</b>, está escalado <b>${tasks[0].Name}</b> - <b>${tasks[0].Task}</b>`, { parse_mode: "HTML" })
                        break;
                    }


                case "help":
                    await bot.sendMessage(chatID, `
                    Comandos bot: \n- /escala: retornar toda escala \n- /configSchedule: configura o chat para receber notificações \n- /proxCulto: mostra quem ficará no próximo culto`)
                    break;

                default:
                    bot.sendMessage(chatID, "Comando não identificado. Use o /help para conhecer os comandos.")
            }
        }
    }
}

botService.handleChatBot()