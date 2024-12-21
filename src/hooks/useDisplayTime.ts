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

  return {
    displayTime,
    setDisplayTime,
    displayYear,
    displayMonth,
    displayDate,
    TODAY,
  }
}

export default useDisplayTime
