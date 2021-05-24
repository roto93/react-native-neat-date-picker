import { useState, useEffect } from 'react'


/**
 * input date
 * output {days, firstDay, prevMonthDays}
 * 
 * days: how many days in this month.
 * firstDay: What day is the first day of this month
 * prevMonthDays: how many days in the previous month
 * 
 */


const useDaysOfMonth = (inputDate, minTime, maxTime) => {
    const Time = {
        year: inputDate.getFullYear(),
        month: inputDate.getMonth(), // 0-base
        date: inputDate.getDate(),
    }
    const [displayYear, setDisplayYear] = useState(Time.year);
    const [displayMonth, setDisplayMonth] = useState(Time.month);
    const [dateArray, setDateArray] = useState([]);
    let days = new Date(Time.year, Time.month + 1, 0).getDate()
    let firstDay = new Date(Time.year, Time.month, 1).getDay()
    let prevMonthDays = new Date(Time.year, Time.month, 0).getDate()

    const createDateArray = () => {
        let arr = Array.from(Array(days), ((_, i) => {
            if (minTime & maxTime) {
                let disableKey = false
                let thisKeyTime = new Date(Time.year, Time.month, i)
                if (thisKeyTime.getTime() >= maxTime | thisKeyTime.getTime() < minTime) {
                    disableKey = true
                }
                return { year: Time.year, month: Time.month, date: i + 1, fontFamily: 'Roboto_700Bold', disable: disableKey }
            } else return { year: Time.year, month: Time.month, date: i + 1, fontFamily: 'Roboto_700Bold', opacity: 1 }
        }))

        let insertingInFrontCount = 1
        let prevMonthDaysNumber = prevMonthDays
        while (insertingInFrontCount <= firstDay) {
            let insertingTime = { year: Time.year, month: Time.month - 1, date: (prevMonthDays), fontFamily: 'Roboto_300Light' }
            if (minTime & maxTime) {
                let disableKey = false
                let thisKeyTime = new Date(Time.year, Time.month - 1, prevMonthDaysNumber)
                if (thisKeyTime.getTime() >= maxTime | thisKeyTime.getTime() < minTime) {
                    disableKey = true
                }
                arr.unshift({ ...insertingTime, date: (--prevMonthDaysNumber), disable: disableKey })
                insertingInFrontCount++

            } else {
                arr.unshift(insertingTime)
                insertingTime = { ...insertingTime, date: (--prevMonthDaysNumber) }
                insertingInFrontCount++
            }
        }

        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) {
            let insertingTime = { year: Time.year, month: Time.month + 1, date: (i * -1), fontFamily: 'Roboto_300Light' }
            if (minTime & maxTime) {
                let disableKey = false
                let thisKeyTime = new Date(Time.year, Time.month + 1, i * -1)
                if (thisKeyTime.getTime() >= maxTime | thisKeyTime.getTime() < minTime) {
                    disableKey = true
                }
                arr.push({ ...insertingTime, disable: disableKey }); i--
            } else {
                arr.push(insertingTime); i--
            }
        }
        return arr
    }

    useEffect(() => {
        setDateArray(createDateArray())
        setDisplayMonth(Time.month)
        setDisplayYear(Time.year)
    }, [inputDate, minTime, maxTime])
    return { displayYear, displayMonth, dateArray }
}

export default useDaysOfMonth
