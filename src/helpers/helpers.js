export const jsonTo2DArray = jsonData => {
    let normalizedCount = 0
    const normalizedData = jsonData.map(element => {
        normalizedCount = (element.count - jsonData.slice(-1)[0].count) / (jsonData[0].count - jsonData.slice(-1)[0].count) * 120
        return [element.word , normalizedCount]
    })
    return [...normalizedData]
}
