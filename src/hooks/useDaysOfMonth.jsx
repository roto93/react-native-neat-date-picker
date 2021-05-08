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


const useDaysOfMonth = (inputTime) => {
    const [dateArray, setDateArray] = useState([]);
    const Time = {
        year: inputTime.getFullYear(),
        month: inputTime.getMonth(), // 0-base
        date: inputTime.getDate(),
    }
    let days = new Date(Time.year, Time.month + 1, 0).getDate()
    let firstDay = new Date(Time.year, Time.month, 1).getDay()
    let prevMonthDays = new Date(Time.year, Time.month, 0).getDate()


    const createDateArray = () => {
        let arr = Array.from(Array(days), ((_, i) => ({ year: Time.year, month: Time.month, date: i + 1, textOpacity: 1 })))

        let insertingInFrontCount = 1
        let insertingTime = { year: Time.year, month: Time.month - 1, date: (prevMonthDays), textOpacity: 0.25 }
        let prevMonthDaysNumber = prevMonthDays
        while (insertingInFrontCount <= firstDay) {
            arr.unshift(insertingTime)
            insertingTime = { ...insertingTime, date: (--prevMonthDaysNumber) }
            insertingInFrontCount++
        }

        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) {
            let insertingTime = { year: Time.year, month: Time.month + 1, date: (i * -1), textOpacity: 0.25 }
            arr.push(insertingTime); i--
        }
        return arr
    }


    useEffect(() => {
        setDateArray(createDateArray())
        return () => {
            setDateArray()
        }
    }, [inputTime])
    return { dateArray }
}

export default useDaysOfMonth
