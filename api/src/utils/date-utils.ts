export const getTaskDateDetails = (taskDay: Date) => {
    let month = taskDay.getMonth() 
    let year = taskDay.getFullYear()
    let dayOfWeek = taskDay.getUTCDay() 
    let day = taskDay.getUTCDate() 

    return { month, year, day, dayOfWeek }
}