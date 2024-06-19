export const getTaskDateDetails = (taskDay: Date) => {
    const date = new Date(taskDay)
  
    let month = date.getMonth() 
    let year = date.getFullYear()
    let dayOfWeek = date.getUTCDay() 
    let day = date.getUTCDate() 

    return { month, year, day, dayOfWeek }
}