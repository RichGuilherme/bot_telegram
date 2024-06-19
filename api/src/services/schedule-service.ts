import schedule from 'node-schedule'
import { TaskRepositories } from "../repository/tasks-repository"
import { ITask } from "../interfaces/task"
import { sendMessageBot } from '../controllers/bot'
import { getTaskDateDetails } from '../utils/date-utils'

const scheduleJob = (rule: schedule.RecurrenceRule, task: ITask) => {
    schedule.scheduleJob(rule, async () => {
        try {
            await sendMessageBot(task.Name, task.Day, task.Task)
            console.log("Mensagem agendada enviada")

            await TaskRepositories.deleteTasks(task.id)
        } catch (error) {
            console.error('Erro ao enviar mensagem agendada:', error)
        }
    })

    console.log(`Scheduled job for task: ${task.Name} at ${rule.hour}:${rule.minute} on ${rule.date}/${rule.month}/${rule.year}`);
}

// Essa função serve para criar as regras de agendamento do scheduleJob. 
// Ao sábados e domingo o agendamento é feito de forma diferente. Sendo duas tarefas, agendadas em tempos diferente.
// 
const ruleScheduleJob = (dayOfWeek: number, month: number, year: number, day: number): schedule.RecurrenceRule[] => {
    let rules: schedule.RecurrenceRule[] = []

    switch (dayOfWeek) {
        case 6: // Sábado
            // Regra para aviso às 11h
            let rule11 = new schedule.RecurrenceRule()
            rule11.month = month
            rule11.date = day
            rule11.year = year
            rule11.hour = 11
            rule11.minute = 0
            rules.push(rule11)

            // Regra para aviso às 13h
            let rule13 = new schedule.RecurrenceRule()
            rule13.month = month
            rule13.date = day
            rule13.year = year
            rule13.hour = 13
            rule13.minute = 0
            rules.push(rule13)

            break;

        case 0: // Domingo
            // Regra para aviso no sábado às 19h
            let ruleSaturday19 = new schedule.RecurrenceRule()
            ruleSaturday19.month = month
            ruleSaturday19.date = day - 1
            ruleSaturday19.year = year
            ruleSaturday19.hour = 19
            ruleSaturday19.minute = 0
            rules.push(ruleSaturday19)

            // Regra para aviso no domingo às 13h
            let ruleSunday13 = new schedule.RecurrenceRule()
            ruleSunday13.month = month
            ruleSunday13.date = day
            ruleSunday13.year = year
            ruleSunday13.hour = 13
            ruleSunday13.minute = 0
            rules.push(ruleSunday13)

            break;

        case 3: // Terça
            // Regra para aviso no sábado às 19h
            let ruleTuesday16 = new schedule.RecurrenceRule()
            ruleTuesday16.month = month
            ruleTuesday16.date = day
            ruleTuesday16.year = year
            ruleTuesday16.hour = 16
            ruleTuesday16.minute = 20
            rules.push(ruleTuesday16)

            // Regra para aviso no domingo às 13h
            let ruleTuesday17 = new schedule.RecurrenceRule()
            ruleTuesday17.month = month
            ruleTuesday17.date = day
            ruleTuesday17.year = year
            ruleTuesday17.hour = 16
            ruleTuesday17.minute = 25
            rules.push(ruleTuesday17)
            break;

        default:
            // Regras padrões para os dias da semana
            let ruleDefault = new schedule.RecurrenceRule()
            ruleDefault.month = month
            ruleDefault.date = day
            ruleDefault.year = year
            ruleDefault.hour = 15
            ruleDefault.minute = 0
            rules.push(ruleDefault)
    }

    return rules
}

export const scheduleMessage = async () => {
    let taskValues: ITask[] = []

    try {
        taskValues = await TaskRepositories.getClosestTask() as ITask[]
        if (!taskValues) {
            console.warn('No task found')
            return
        }

    } catch (err) {
        console.error('Error fetching task:', err)
        return
    }


    // Agrupar as tarefas pelo dia
    const tasksGroupedByDay: { [key: string]: ITask[] } = {}
    taskValues.forEach(task => {
        const taskDay = String(task.Day).split('T')[0]
        if (!tasksGroupedByDay[taskDay]) {
            tasksGroupedByDay[taskDay] = []
        }
        tasksGroupedByDay[taskDay].push(task)
    })

    // Percorrer cada grupo de tarefas e distribuir entre os horários disponíveis
    for (const [taskDay, tasks] of Object.entries(tasksGroupedByDay)) {
        const { month, year, day, dayOfWeek } = getTaskDateDetails(new Date(taskDay))
        const rules = ruleScheduleJob(dayOfWeek, month, year, day)

        tasks.forEach((task, index) => {
            const rule = rules[index % rules.length]
            scheduleJob(rule, task)
        })
    }
}

scheduleMessage()