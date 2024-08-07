import schedule from 'node-schedule'
import { ITask } from "../models/task"
import { getTaskDateDetails } from '../utils/date-utils'
import { botService } from './bot-service'
import { tasksRepository } from '../repository/tasks-repository'
import chalk from 'chalk'

const scheduleJob = (rule: schedule.RecurrenceRule, task: ITask) => {
    const job = schedule.scheduleJob(rule, async () => {
        try {
            await botService.sendScheduledMessage(task.Name, task.Day, task.Task)
            console.log(chalk.green("Mensagem agendada enviada"))

            await tasksRepository.deleteTasks(task.id)
            console.log(chalk.green('Tarefa deletada!'))
        } catch (error) {
            console.error(chalk.red('Erro ao enviar mensagem agendada: %s'), error)
        }
    })

    console.log(task, job.nextInvocation())
}

// Essa função serve para criar as regras de agendamento do scheduleJob. 
// domingo de manhã, noite e culto de eventos, terão o horário diferente de agendamento.
const ruleScheduleJob = (eventType: string, month: number, year: number, day: number): schedule.RecurrenceRule => {
    const rule = new schedule.RecurrenceRule()
    let eventPeriod: string = eventType.toLowerCase().match(/manhã|noite|evento/)?.[0] || ''

    rule.month = month
    rule.date = day
    rule.year = year
    rule.tz = "America/Sao_Paulo"

    switch (eventPeriod) {
        case "manhã":
            rule.hour = 19
            rule.minute = 0
            rule.date = day - 1
            break
        case "noite":
            rule.hour = 15
            rule.minute = 0
            break
        case "evento":
            rule.hour = 8
            rule.minute = 0
            break
        default:
            rule.hour = 13
            rule.minute = 0
    }

    return rule
}

export const scheduleMessage = async () => {
    try {
        const taskValues: ITask[] = await tasksRepository.getClosestTask()

        if (!taskValues || taskValues.length === 0) {
            console.error(chalk.yellow("Nenhuma tarefa encontrada"))
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

            const rules = tasks.map(task => ruleScheduleJob(task.Task, month, year, day))

            tasks.forEach((task, index) => {
                const rule = rules[index % rules.length]

                scheduleJob(rule, task)
            })
        }
    }
    catch (error) {
        console.error(chalk.red("Erro ao agendar mensagens: %s"), error)
    }
}

scheduleMessage()