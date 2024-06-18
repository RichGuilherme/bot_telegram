export const formatDate = (dateStr: Date): string => {
    const [year, month, day] = String(dateStr).split("T")[0].split('-')

    return `${day}-${month}-${year}`
}