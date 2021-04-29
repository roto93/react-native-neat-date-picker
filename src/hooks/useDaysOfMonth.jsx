import { useState, useEffect } from 'react'


// input date
// output how many dates in that month

const inputTime = new Date()

const useDaysOfMonth = () => {
    const year = inputTime.getFullYear()
    const month = inputTime.getMonth()
    new Date(year, month, 0).getDate()


}

export default useDaysOfMonth
