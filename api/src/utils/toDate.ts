export const toDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-").map(Number)

    return new Date(year, month, day)
}
