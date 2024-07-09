import schedule from 'node-schedule'
import { ITask } from "../models/task"
import { getTaskDateDetails } from '../utils/date-utils'
import { botService } from './bot-service'
import { tasksRepository } from '../repository/tasks-repository'

const scheduleJob = (rule: schedule.RecurrenceRule, task: ITask) => {
    const job = schedule.scheduleJob(rule, async () => {
        try {
            await botService.sendScheduledMessage(task.Name, task.Day, task.Task)
            console.log("Mensagem agendada enviada")

            await tasksRepository.deleteTasks(task.id)
            
        } catch (error) {
            console.error('Erro ao enviar mensagem agendada:', error)
        }
    })

    console.log(task, job.nextInvocation())
}

// Essa função serve para criar as regras de agendamento do scheduleJob. 
// domingo de manhã, noite e culto de eventos, terão o horário diferente de agendamento.
const ruleScheduleJob = (eventType: string, month: number, year: number, day: number): schedule.RecurrenceRule[] => {
    let rules: schedule.RecurrenceRule[] = []
    let eventPeriod: string = eventType.toLowerCase().match(/manhã|noite|evento/)?.[0] || ''

    switch (eventPeriod) {
        case "manhã":
            // Regra para aviso no sábado às 19h
            let ruleSaturdayMorning = new schedule.RecurrenceRule()
            ruleSaturdayMorning.month = month
            ruleSaturdayMorning.date = day - 1
            ruleSaturdayMorning.year = year
            ruleSaturdayMorning.hour = 19
            ruleSaturdayMorning.minute = 0
            ruleSaturdayMorning.tz = "America/sao_paulo"
            rules.push(ruleSaturdayMorning)
            break;

        case "noite":
            // Regra para aviso no domingo às 15h
            let ruleSundayNight = new schedule.RecurrenceRule()
            ruleSundayNight.month = month
            ruleSundayNight.date = day
            ruleSundayNight.year = year
            ruleSundayNight.hour = 15
            ruleSundayNight.minute = 0
            ruleSundayNight.tz = "America/sao_paulo"
            rules.push(ruleSundayNight)
            break;

        case "evento":
            // Regra para aviso no sábado às 8h
            let ruleSaturdayEvent = new schedule.RecurrenceRule()
            ruleSaturdayEvent.month = month
            ruleSaturdayEvent.date = day
            ruleSaturdayEvent.year = year
            ruleSaturdayEvent.hour = 8
            ruleSaturdayEvent.minute = 0
            ruleSaturdayEvent.tz = "America/sao_paulo"
            rules.push(ruleSaturdayEvent)

            break;

        default:
            let ruleDefault = new schedule.RecurrenceRule()
            ruleDefault.month = month
            ruleDefault.date = day
            ruleDefault.year = year
            ruleDefault.hour = 13
            ruleDefault.minute = 0
            ruleDefault.tz = "America/sao_paulo"
            rules.push(ruleDefault)
    }

    return rules
}

export const scheduleMessage = async () => {
    let taskValues: ITask[] = [];

    taskValues = await tasksRepository.getClosestTask() as ITask[]
    if (!taskValues || taskValues.length === 0) {
        console.error("Nenhuma tarefa encontrada")
        return
    }

    const tasksGroupedByDay: { [key: string]: ITask[] } = {}
    taskValues.forEach(task => {
        const taskDay = String(task.Day).split('T')[0]
        if (!tasksGroupedByDay[taskDay]) {
            tasksGroupedByDay[taskDay] = []
        }
        tasksGroupedByDay[taskDay].push(task)
    })


    for (const [taskDay, tasks] of Object.entries(tasksGroupedByDay)) {
        const { month, year, day } = getTaskDateDetails(new Date(taskDay))

        const rules = tasks.map(task => ruleScheduleJob(task.Task, month, year, day)[0])

        tasks.forEach((task, index) => {
            const rule = rules[index % rules.length]

            scheduleJob(rule, task)
        })
    }

}

scheduleMessage()