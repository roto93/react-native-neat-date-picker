import type { Dispatch, FC, SetStateAction } from 'react'
import {
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RangeOutput, SingleOutput } from './NeatDatePicker.type'

type Day = {
  year: number
  month: number
  date: number
  isCurrentMonth: boolean
  disabled: boolean
}

type colorOptions = {
  dateTextColor: ColorValue
  backgroundColor: ColorValue
  selectedDateTextColor: ColorValue
  selectedDateBackgroundColor: ColorValue
}

export type Mode = 'single' | 'range'

type KeyProps = {
  colorOptions: colorOptions
  Day: Day
  mode: Mode
  output: SingleOutput | RangeOutput
  setOutput: Dispatch<SetStateAction<SingleOutput | RangeOutput>>
}

const Key: FC<KeyProps> = ({
  colorOptions,
  Day,
  mode,
  output,
  setOutput,
}: KeyProps) => {
  const {
    dateTextColor,
    backgroundColor,
    selectedDateTextColor,
    selectedDateBackgroundColor,
  } = colorOptions
  const singleMode = mode === 'single'
  const rangeMode = mode === 'range'

  const onKeyPress = () => {
    if (Day.disabled) return

    const newDate = new Date(Day.year, Day.month, Day.date)

    if (singleMode) {
      const singleOutput = output as SingleOutput
      const newOutPut = { ...singleOutput, date: newDate }
      setOutput(newOutPut)
      return
    }

    if (rangeMode) {
      const rangeOutput = output as RangeOutput
      const isSettingStartDate =
        !rangeOutput.startDate ||
        rangeOutput.endDate ||
        newDate.getTime() < rangeOutput.startDate?.getTime()
      if (isSettingStartDate) {
        const newOutPut = { ...output, startDate: newDate, endDate: undefined }
        setOutput(newOutPut)
      } else {
        const newOutPut = { ...output, endDate: newDate }
        setOutput(newOutPut)
      }
    }
  }

  const getColor = () => {
    const selectedColors = {
      bgc: selectedDateBackgroundColor,
      text: selectedDateTextColor,
    }
    const notSelectedColors = { bgc: backgroundColor, text: dateTextColor }
    const disabledColors = {
      bgc: backgroundColor,
      text: `${dateTextColor.toString()}55`,
    }

    if (Day.isCurrentMonth === false) {
      selectedColors.bgc = selectedDateBackgroundColor.toString() + '22'
      notSelectedColors.text = dateTextColor.toString() + '22'
      disabledColors.text = dateTextColor.toString() + '22'
    }

    const timeOfThisKey = new Date(Day.year, Day.month, Day.date).getTime()

    if (Day.disabled) return disabledColors
    /**
     * If the mode is single, then this conditional will be true
     */
    if (singleMode) {
      const singleOutput = output as SingleOutput
      const date = singleOutput.date as Date
      const isThisDateSelected = timeOfThisKey === date.getTime()
      return isThisDateSelected ? selectedColors : notSelectedColors
    }

    /**
     * Is the conditional above is false, then the mode is range and this piece of code will be executed.
     * As you can see, I delete an unnecessary extra conditional.
     */
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

  const { bgc, text: textColor } = getColor()

  return (
    <TouchableOpacity onPress={onKeyPress} style={styles.pressArea}>
      <View style={[styles.keys, { backgroundColor: bgc }]}>
        <Text style={[styles.keys_text, { color: textColor }]}>
          {' '}
          {Day.date}{' '}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pressArea: {
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  keys: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keys_text: {
    fontSize: 16,
    fontWeight: '500',
    // fontFamily: 'Roboto_500Medium'
  },
})

export default Key
