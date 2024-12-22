import { useCallback, useState } from 'react'

/**
 * displayTime defines which month is going to be shown onto the screen
 *
 * For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
 * @param initialDate Date
 */
const useDisplayTime = (initialDate?: Date, minDate?: Date, maxDate?: Date) => {
  const [displayTime, setDisplayTime] = useState(initialDate ?? new Date())

  const displayYear = displayTime.getFullYear()
  const displayMonth = displayTime.getMonth() // 0-base
  const displayDate = displayTime.getDate()

  const TODAY = new Date(displayYear, displayMonth, displayDate)

  const currentMonthLastDate = new Date(displayYear, displayMonth + 1, 0)
  const firstDisplayDate = new Date(displayYear, displayMonth, 1)

  const canGoPreviousMonth =
    firstDisplayDate === undefined ||
    minDate === undefined ||
    minDate < firstDisplayDate
  const canGoNextMonth =
    maxDate === undefined ||
    currentMonthLastDate === undefined ||
    maxDate > currentMonthLastDate

  const goToDate = (year: number, month: number, date: number) => {
    const newDate = new Date(year, month, date)
    if (minDate && newDate < minDate) return setDisplayTime(minDate)
    if (maxDate && newDate > maxDate) return setDisplayTime(maxDate)
    setDisplayTime(new Date(year, month, date))
  }

  const toPrevMonth = useCallback(() => {
    if (!canGoPreviousMonth) return
    const { year, month, date } = destructureDisplayTime(displayTime)
    goToDate(year, month - 1, date)
  }, [displayTime])
  const toNextMonth = useCallback(() => {
    if (!canGoNextMonth) return
    const { year, month, date } = destructureDisplayTime(displayTime)
    goToDate(year, month + 1, date)
  }, [displayTime])

  return {
    displayTime,
    setDisplayTime,
    displayYear,
    displayMonth,
    displayDate,
    TODAY,
    toPrevMonth,
    toNextMonth,
    goToDate,
    canGoPreviousMonth,
    canGoNextMonth,
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
