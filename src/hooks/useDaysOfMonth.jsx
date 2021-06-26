import { useState, useEffect } from 'react'


/**
 * input date
 * 
 * inputYear: 
 * inputMonth: 0-base
 * dateArray: An array that contains same amount of number as how many days in inputMonth, inputYear.
 *  Also contain last few days of the previous month, and first few days of the next month.
 *  eg. 2021Feb starts from Monday and ends on Saturday,  dateArray = [1,2,3,4,...,27,28]
 * 
 * 
 */


const useDaysOfMonth = (inputYear, inputMonth, minTime, maxTime) => {
    const [dateArray, setDateArray] = useState([]);
    let days = new Date(inputYear, inputMonth + 1, 0).getDate()
    let firstDay = new Date(inputYear, inputMonth, 1).getDay()
    let prevMonthDays = new Date(inputYear, inputMonth, 0).getDate()

    const createDateArray = () => {
        let arr = Array.from(Array(days), ((_, i) => {
            if (minTime & maxTime) {
                let thisKeyTime = new Date(inputYear, inputMonth, i + 1)
                const shouldDisableKey = thisKeyTime.getTime() > maxTime || thisKeyTime.getTime() < minTime

                let disableKey = false
                if (shouldDisableKey) disableKey = true

                return { year: inputYear, month: inputMonth, date: i + 1, disable: disableKey }
            } else return { year: inputYear, month: inputMonth, date: i + 1, opacity: 1 }
        }))


        let daysShouldInsert = firstDay
        let prevMonthDaysNumber = prevMonthDays
        while (daysShouldInsert > 0 & daysShouldInsert < 7) {
            let insertingTime = { year: inputYear, month: inputMonth - 1, disable: false }
            if (minTime & maxTime) {
                const thisKeyTime = new Date(inputYear, inputMonth - 1, prevMonthDaysNumber)
                const shouldDisableKey = thisKeyTime.getTime() >= maxTime || thisKeyTime.getTime() < minTime

                let disableKey = false
                if (shouldDisableKey) disableKey = true

                arr.unshift({ ...insertingTime, date: prevMonthDaysNumber, disable: disableKey })
                prevMonthDaysNumber--
                daysShouldInsert--
            } else {
                insertingTime = { ...insertingTime, date: prevMonthDaysNumber }
                arr.unshift(insertingTime)
                prevMonthDaysNumber--
                daysShouldInsert--
            }
        }


        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) {
            let insertingTime = { year: inputYear, month: inputMonth + 1, date: (i * -1), }
            if (minTime & maxTime) {
                const thisKeyTime = new Date(inputYear, inputMonth + 1, i * -1)
                const shouldDisableKey = thisKeyTime.getTime() >= maxTime || thisKeyTime.getTime() < minTime

                let disableKey = false
                if (shouldDisableKey) disableKey = true

                arr.push({ ...insertingTime, disable: disableKey })
                i--
            } else {
                arr.push(insertingTime)
                i--
            }
        }
        return arr
    }

    useEffect(() => {
        setDateArray(createDateArray())
    }, [inputYear, inputMonth, minTime, maxTime])

    return { dateArray }
}

export default useDaysOfMonth
