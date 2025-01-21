import { useCallback, useEffect, useState } from 'react'
import { I18nManager, StyleSheet, Text, View } from 'react-native'
import format from '../dateformat'
import useDaysOfMonth from '../hooks/useDaysOfMonth'
import useDisplayTime from '../hooks/useDisplayTime'
import useOutput from '../hooks/useOutput'
import { TranslationMap } from '../lib/lib'
import ChangeYearModal from './ChangeYearModal'
import Key from './Key'
import ModalFooter from './ModalFooter'
import ModalHandler from './ModalHandler'
import ModalHeader from './ModalHeader'
import {
  Day,
  NeatDatePickerProps,
  RangeOutput,
  SingleOutput,
} from './NeatDatePicker.type'

I18nManager.allowRTL(false)

const NeatDatePicker = (props: NeatDatePickerProps) => {
  let {
    language,
    customLanguageConfig,
    isVisible,
    initialDate,
    minDate,
    maxDate,
    modalStyles,
    colorOptions,
    withoutModal,
    chooseYearFirst,
    dateStringFormat,
    onConfirm,
    onCancel,
    onBackdropPress,
    onBackButtonPress,
  } = props

  dateStringFormat ??= 'yyyy-mm-dd'
  modalStyles ??= { justifyContent: 'center' }

  const translation = customLanguageConfig ?? TranslationMap[language ?? 'en']

  const {
    displayTime,
    setDisplayTime,
    displayYear,
    displayMonth,
    TODAY,
    toPrevMonth,
    toNextMonth,
    goToDate,
    canGoPreviousMonth,
    canGoNextMonth,
  } = useDisplayTime(initialDate, minDate, maxDate)

  const mode = props.mode
  const { output, setOutput, originalOutput, setOriginalOutput } = useOutput(
    mode,
    TODAY,
    mode === 'range' ? props.startDate : undefined,
    mode === 'range' ? props.endDate : undefined,
  )

  const minTime = minDate?.getTime()
  const maxTime = maxDate?.getTime()

  // useDaysOfMonth returns an array that having several objects,
  // representing all the days that are going to be rendered on screen.
  // Each object contains five properties, 'year', 'month', 'date', 'isCurrentMonth' and 'disabled'.
  const days = useDaysOfMonth(displayYear, displayMonth, minTime, maxTime)

  const [showChangeYearModal, setShowChangeYearModal] = useState(
    chooseYearFirst ?? false,
  )
  const openYearModal = useCallback(() => setShowChangeYearModal(true), [])

  // destructure colorOptions
  const colors = { ...defaultColorOptions, ...colorOptions }
  const {
    backgroundColor,
    weekDaysColor,
    dateTextColor,
    selectedDateTextColor,
    selectedDateBackgroundColor,
    changeYearModalColor,
  } = colors

  const sevenDays = translation.weekDays

  const handleKeyPress = useCallback((day: Day) => {
    if (day.disabled) return

    const newDate = new Date(day.year, day.month, day.date)

    setOutput((prevOutput) => {
      if (mode === 'single') {
        const singleOutput = prevOutput as SingleOutput
        return { ...singleOutput, date: newDate }
      }

      const rangeOutput = prevOutput as RangeOutput
      const isSettingStartDate =
        !rangeOutput.startDate ||
        rangeOutput.endDate ||
        newDate.getTime() < rangeOutput.startDate?.getTime()

      return isSettingStartDate
        ? { ...prevOutput, startDate: newDate, endDate: undefined }
        : { ...prevOutput, endDate: newDate }
    })
  }, [])

  const onCancelPress = () => {
    onCancel()
    setTimeout(() => {
      // reset output to originalOutput
      setOutput(originalOutput)

      // originalOutput.startDate will be null only when the user hasn't picked any date using RANGE DatePicker.
      // If that's the case, don't reset displayTime to originalOutput but initialDate/new Date()
      if (mode === 'range' && !(originalOutput as RangeOutput).startDate)
        return setDisplayTime(initialDate || new Date())

      // reset displayTime
      return mode === 'single'
        ? setDisplayTime((originalOutput as SingleOutput).date ?? new Date())
        : setDisplayTime(
            (originalOutput as RangeOutput).startDate ?? new Date(),
          )
    }, 300)
  }

  const autoCompleteEndDate = (output: RangeOutput) => {
    // set endDate to startDate
    output.endDate = output.startDate

    // After successfully passing arguments in onConfirm, in next life cycle set endDate to undefined.
    // Therefore, next time when user opens DatePicker he can start from selecting endDate.
    setOutput({ ...output, endDate: undefined })
  }

  const onConfirmPress = () => {
    if (mode === 'single') {
      const singleOutput = output as SingleOutput

      const dateString = format(singleOutput.date as Date, dateStringFormat)
      const newOutput = {
        ...singleOutput,
        dateString,
        startDate: undefined,
        startDateString: undefined,
        endDate: undefined,
        endDateString: undefined,
      }
      onConfirm(newOutput)
    } else {
      // If have not selected any date, just do onCancel
      const RangeOutput = output as RangeOutput
      if (!RangeOutput.startDate) return onCancel()

      //  If have not selected endDate, set it same as startDate
      if (!RangeOutput.endDate) autoCompleteEndDate(RangeOutput)
      const startDateString = format(
        RangeOutput.startDate as Date,
        dateStringFormat,
      )
      const endDateString = format(
        RangeOutput.endDate as Date,
        dateStringFormat,
      )
      const newOutput = {
        ...RangeOutput,
        startDateString,
        endDateString,
        date: undefined,
        dateString: undefined,
      }
      onConfirm(newOutput)
    }

    // Because the selected dates are confirmed, originalOutput should be updated.
    setOriginalOutput({ ...output })

    // reset displayTime
    setTimeout(() => {
      return mode === 'single'
        ? setDisplayTime((output as SingleOutput).date as Date)
        : setDisplayTime((output as RangeOutput).startDate as Date)
    }, 300)
  }

  const getColor = (day: Day) => {
    const selectedColors = {
      bgc: selectedDateBackgroundColor,
      textColor: selectedDateTextColor,
    }
    const notSelectedColors = {
      bgc: backgroundColor,
      textColor: dateTextColor,
    }
    const disabledColors = {
      bgc: backgroundColor,
      textColor: `${dateTextColor.toString()}55`,
    }
    if (day.disabled) return disabledColors

    const timeOfThisKey = new Date(day.year, day.month, day.date).getTime()

    if (day.isCurrentMonth === false) {
      selectedColors.bgc = selectedDateBackgroundColor.toString() + '22'
      notSelectedColors.textColor = dateTextColor.toString() + '22'
      disabledColors.textColor = dateTextColor.toString() + '22'
    }

    if (mode === 'single') {
      const singleOutput = output as SingleOutput
      const date = singleOutput.date as Date
      const isThisDateSelected = timeOfThisKey === date.getTime()
      return isThisDateSelected ? selectedColors : notSelectedColors
    }

    const rangeOutput = output as RangeOutput
    if (!rangeOutput.endDate) {
      return timeOfThisKey === rangeOutput.startDate?.getTime()
        ? selectedColors
        : notSelectedColors
    }

    const startDate = rangeOutput.startDate as Date
    const isThisDayInSelectedRange =
      timeOfThisKey >= startDate.getTime() &&
      timeOfThisKey <= rangeOutput.endDate.getTime()
    return isThisDayInSelectedRange ? selectedColors : notSelectedColors
  }

  useEffect(() => {
    const [y, m, d] = [
      initialDate?.getFullYear(),
      initialDate?.getMonth(),
      initialDate?.getDate(),
    ]
    const updatedInitalDate = initialDate && new Date(y!, m!, d!)

    const newOutput =
      mode === 'single'
        ? {
            date: updatedInitalDate ?? TODAY,
            startDate: undefined,
            endDate: undefined,
          }
        : {
            date: undefined,
            startDate: updatedInitalDate ?? props.startDate ?? TODAY,
            endDate: props.endDate,
          }

    setOutput(newOutput)
    setOriginalOutput({ ...newOutput })
  }, [mode, initialDate])

  return (
    <ModalHandler
      {...{
        withoutModal,
        isVisible,
        modalStyles,
        onBackButtonPress,
        onBackdropPress,
        onCancelPress,
      }}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <ModalHeader
          {...{
            days,
            colors,
            translation,
            toNextMonth,
            toPrevMonth,
            openYearModal,
            canGoPreviousMonth,
            canGoNextMonth,
          }}
        />

        <View style={styles.keys_container}>
          {/* week days  */}
          {sevenDays.map((weekDay: string, index: number) => (
            <View style={styles.keys} key={index.toString()}>
              <Text style={[styles.weekDays, { color: weekDaysColor }]}>
                {weekDay}
              </Text>
            </View>
          ))}

          {/* every days */}
          {days.map((Day: Day, i: number) => {
            const { bgc, textColor } = getColor(Day)
            return (
              <Key
                key={Day.year.toString() + Day.month.toString() + i.toString()}
                Day={Day}
                bgc={bgc}
                textColor={textColor}
                onKeyPress={handleKeyPress}
              />
            )
          })}
        </View>

        <ModalFooter
          {...{ colors, translation, onConfirmPress, onCancelPress }}
        />
      </View>
      <ChangeYearModal
        isVisible={showChangeYearModal}
        dismiss={() => setShowChangeYearModal(false)}
        displayTime={displayTime}
        goToDate={goToDate}
        colorOptions={{
          primary: changeYearModalColor,
          backgroundColor,
        }}
      />
    </ModalHandler>
  )
}

export default NeatDatePicker

const styles = StyleSheet.create({
  container: {
    width: 328,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  keys_container: {
    width: 300,
    height: 264,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekDays: {
    fontSize: 16,
  },
  keys: {
    width: 34,
    height: 30,
    borderRadius: 10,
    marginTop: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// Notice: only six-digit HEX values are allowed.
const defaultColorOptions = {
  backgroundColor: '#ffffff',
  headerColor: '#4682E9',
  headerTextColor: '#ffffff',
  changeYearModalColor: '#4682E9',
  weekDaysColor: '#4682E9',
  dateTextColor: '#000000',
  selectedDateTextColor: '#ffffff',
  selectedDateBackgroundColor: '#4682E9',
  confirmButtonColor: '#4682E9',
}
