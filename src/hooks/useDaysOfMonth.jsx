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
    const [days, setDays] = useState(0);
    const [firstDay, setFirstDay] = useState(0)
    const [prevMonthDays, setPrevMonthDays] = useState(0);

    useEffect(() => {
        let year = inputTime.getFullYear()
        let month = inputTime.getMonth()
        setDays(new Date(year, month + 1, 0).getDate())
        setFirstDay(new Date(year, month, 1).getDay())
        setPrevMonthDays(new Date(year, month, 0).getDate())
    }, [inputTime])
    return { days, firstDay, prevMonthDays }
}

export default useDaysOfMonth
