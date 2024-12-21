import { useState } from 'react'

/**
 * displayTime defines which month is going to be shown onto the screen
 *
 * For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
 * @param initialDate Date
 */
const useDisplayTime = (initialDate?: Date) => {
  const [displayTime, setDisplayTime] = useState(initialDate ?? new Date())

  const displayYear = displayTime.getFullYear()
  const displayMonth = displayTime.getMonth() // 0-base
  const displayDate = displayTime.getDate()

  const TODAY = new Date(displayYear, displayMonth, displayDate)

  const showPreviousMonth = () => {
    setDisplayTime((prev) => {
      const { year, month, date } = destructureDisplayTime(prev)
      const newDate = new Date(year, month - 1, date)
      return newDate
    })
  }
  const showNextMonth = () => {
    setDisplayTime((prev) => {
      const { year, month, date } = destructureDisplayTime(prev)
      const newDate = new Date(year, month + 1, date)
      return newDate
    })
  }

  const goToDate = (year: number, month: number, date: number) => {
    setDisplayTime(new Date(year, month, date))
  }

  return {
    displayTime,
    setDisplayTime,
    displayYear,
    displayMonth,
    displayDate,
    TODAY,
    showPreviousMonth,
    showNextMonth,
    goToDate,
  }
}

export default useDisplayTime

const destructureDisplayTime = (displayTime: Date) => {
  return {
    year: displayTime.getFullYear(),
    month: displayTime.getMonth(), // 0-base
    date: displayTime.getDate(),
  }
}
