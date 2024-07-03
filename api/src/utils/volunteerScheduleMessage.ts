import { ITask } from "../models/task"
import { formatDate } from "./formatDate"

export const volunteedScheduleMessage = (taskProps: ITask[]): string => {
    let sendMessageArray: string[] = [`Escala do mês:`]

    for (const task of taskProps){
        sendMessageArray.push(`<b>${task.Name.toUpperCase()}</b>: Dia <b>${formatDate(task.Day)}</b> - <b>${task.Task}</b>`)
    }

    let sendMessage = sendMessageArray.join(`\n\n`)

    return sendMessage
}