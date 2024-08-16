import schedule from 'node-schedule'
import { ITask, TaskType } from "../models/task"
import { getTaskDateDetails } from '../utils/date-utils'
import { botService } from './bot-service'
import { tasksRepository } from '../repository/tasks-repository'
import chalk from 'chalk'
import { ISchedule } from '../models/schedule'


const createRule = (period: string, day: number, month: number, year: number): schedule.RecurrenceRule => {
    const rule = new schedule.RecurrenceRule()
    rule.date = day
    rule.month = month
    rule.year = year
    rule.tz = "America/Sao_Paulo"

    switch (period) {
        case "manhã":
            rule.hour = 19
            rule.minute = 30
            rule.date = day - 1
            break
        case "noite":
            rule.hour = 15
            rule.minute = 30
            break
        case "evento":
            rule.hour = 10
            rule.minute = 0
            break
        default:
            rule.hour = 18
            rule.minute = 40
    }

    return rule
}

const determinePeriod = (task: string): string => {
    const match = task.match(/manhã|noite|evento/)
    return match ? match[0] : ''
}

const determineType = (task: string): TaskType | null => {
    if (task.includes('projeção')) {
        return 'projeção'
    }
    if (task.includes('transmissão')) {
        return 'transmissão'
    }

    return null
}

const scheduleMessagesForDay = (tasks: ISchedule, date: string) => {
    const { month, year, day } = getTaskDateDetails(new Date(date))

    Object.entries(tasks[date]).forEach(([period, tasksForPeriod]) => {
        if (tasksForPeriod.projeção || tasksForPeriod.transmissão) {
            const rule = createRule(period, day, month, year)
            const taskNames = []

            if (tasksForPeriod.projeção) taskNames.push(`Projeção: ${tasksForPeriod.projeção.Name}`)
            if (tasksForPeriod.transmissão) taskNames.push(`Transmissão: ${tasksForPeriod.transmissão.Name}`)

            const message = `Escala para o próximo culto:\n${taskNames.join('\n')}`

            scheduleJob(rule, message, tasksForPeriod)
        }
    })
}

const scheduleJob = (rule: schedule.RecurrenceRule, message: string, tasksForPeriod: { projeção?: ITask, transmissão?: ITask }) => {
    const job = schedule.scheduleJob(rule, async () => {
        try {
            await botService.sendScheduledMessage(message)
            console.log(chalk.green("Mensagem agendada enviada"))

            if (tasksForPeriod.projeção) {
                await tasksRepository.deleteTasks(tasksForPeriod.projeção.id)
            }
            if (tasksForPeriod.transmissão) {
                await tasksRepository.deleteTasks(tasksForPeriod.transmissão.id)
            }

        } catch (error) {
            console.error(chalk.red('Erro ao enviar mensagem agendada: %s'), error)
        }
    })

    console.log(job.nextInvocation())
}

export const scheduleMessage = async () => {
    try {
        const tasks: ITask[] = await tasksRepository.getClosestTask()

        if (!tasks || tasks.length === 0) {
            console.error(chalk.yellow("Nenhuma tarefa encontrada"))
            return
        }

        const schedule = tasks.reduce<ISchedule>((acc, task) => {
            const date = String(task.Day).split('T')[0]
            const period = determinePeriod(task.Task) || 'geral'
            const type = determineType(task.Task)


            if (!type) return acc

            if (!acc[date]) {
                acc[date] = { manhã: {}, noite: {}, geral: {} }
            }

            if (!acc[date][period]) {
                acc[date][period] = {}
            }

            acc[date][period][type] = task

            return acc
        }, {})

        Object.keys(schedule).forEach(date => scheduleMessagesForDay(schedule, date))
    } catch (error) {
        console.error(chalk.red("Erro ao agendar mensagens: %s"), error)
    }
}

scheduleMessage()