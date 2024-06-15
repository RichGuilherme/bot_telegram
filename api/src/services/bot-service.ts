import TelegramBot from "node-telegram-bot-api"
import schedule from 'node-schedule'
import { TaskRepositories } from "../repository/tasks-repository"
import { ITask } from "../interfaces/task"
import { toDate } from "../utils/toDate"


const token = process.env.TOKEN_TELEGRAM as string
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHATBOT_ID as string

const sendMessageBot = async (day: string, name: string, task: string ): Promise<TelegramBot.Message> => {
    return await bot.sendMessage(chatId, `Hoje dia ${day}, ficará na projeção ${name} no ${task}`)
}

const RuleScheduleJob = (month: number, year: number): schedule.RecurrenceRule => {
    const rule = new schedule.RecurrenceRule()
    const date = new Date()

    rule.month = month - 1
    rule.year = year
    rule.dayOfWeek = [0, 3, 5, 6]
    rule.minute = 33

    if (date.getDay() == 6 && date.getHours() > 17) {
        rule.hour = 20
    } else {
        rule.hour = 17
    }

    return rule
}

(async function scheduleMessage() {
    let name: string;
    let task: string;
    let day: string;
    let mouth: number | undefined;
    let year: number | undefined;

    await TaskRepositories.getClosetsTask()
        .then((value) => {
            if (!value) {
                return
            }

            const valueTask = value as ITask
            name = valueTask.Name
            task = valueTask.Task
            day = valueTask.Day

            const date = new Date(toDate(valueTask.Day))
            mouth = date.getMonth()
            year = date.getFullYear()

        })
        .catch((err) => {
            console.error("Error na busca: ", err)
        })


    if (mouth === undefined || year === undefined) {
        console.error('Mouth ou year não foram definidos corretamente')
        return;
    }

    const job = schedule.scheduleJob(RuleScheduleJob(mouth, year), async () => {
        try {
            await sendMessageBot(day, name, task)
            console.log("Mensagem agendada enviada")
        } catch (error) {
            console.error('Erro ao enviar mensagem agendada:', error)
        }
    })

    console.log(job.nextInvocation())
})()
