import { ITask } from "./task"

export interface ISchedule {
  [key: string]: {
    [period: string]: {
      projeção?: ITask,
      transmissão?: ITask
    }
  }
}