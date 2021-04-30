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
    const year = inputTime.getFullYear()
    const month = inputTime.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const prevMonthDays = new Date(year, month, 0).getDate()
    return { days, firstDay, prevMonthDays }
}

export default useDaysOfMonth
