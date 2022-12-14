import React from "react"
import { StyleSheet, TouchableOpacity, Text, ColorValue } from 'react-native'
import type { Dispatch, FC, SetStateAction } from 'react'

type Day = {
    year: number;
    month: number;
    date: number;
    isCurrentMonth: boolean;
    disabled: boolean;
}
export type Output = {
    date: Date | null;
    startDate: Date | null;
    endDate: Date | null;
}
type colorOptions = {
    dateTextColor: ColorValue;
    backgroundColor: ColorValue;
    selectedDateTextColor: ColorValue;
    selectedDateBackgroundColor: ColorValue;
}
export type Mode = 'single' | 'range';
type KeyProps = {
    colorOptions: colorOptions;
    Day: Day;
    mode: Mode;
    output: Output;
    setOutput: Dispatch<SetStateAction<Output>>;
}

const Key: FC<KeyProps> = ({ colorOptions, Day, mode, output, setOutput }: KeyProps) => {
    const { dateTextColor, backgroundColor, selectedDateTextColor, selectedDateBackgroundColor } = colorOptions
    const singleMode = mode === 'single'
    const rangeMode = mode === 'range'

    const onKeyPress = () => {
        if (Day.disabled) return

        const newDate = new Date(Day.year, Day.month, Day.date)

        const shouldSetStartDate = !output.startDate ||
            output.endDate ||
            (newDate.getTime() < output.startDate?.getTime())

        if (singleMode) {
            const newOutPut = { ...output, date: newDate }
            setOutput(newOutPut)
            return
        }

        if (rangeMode) {
            if (shouldSetStartDate) {
                const newOutPut = { ...output, startDate: newDate, endDate: null }
                setOutput(newOutPut)
            } else {
                const newOutPut = { ...output, endDate: newDate }
                setOutput(newOutPut)
            }
        }
    }

    const getColor = () => {
        const selectedColors = { bgc: selectedDateBackgroundColor, text: selectedDateTextColor }
        const notSelectedColors = { bgc: backgroundColor, text: dateTextColor }
        const disabledColors = { bgc: backgroundColor, text: `${dateTextColor.toString()}55` }

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
            const date = output.date as Date
            const isThisDateSelected = timeOfThisKey === date.getTime()
            return isThisDateSelected ? selectedColors : notSelectedColors
        }

        /**
         * Is the conditional above is false, then the mode is range and this piece of code will be executed.
         * As you can see, I delete an unnecessary extra conditional.
         */
        if (!output.endDate) {
            return timeOfThisKey === output.startDate?.getTime()
                ? selectedColors
                : notSelectedColors
        }

        const startDate = output.startDate as Date
        const isThisDayInSelectedRange = timeOfThisKey >= startDate.getTime() && timeOfThisKey <= output.endDate.getTime()
        return isThisDayInSelectedRange ? selectedColors : notSelectedColors
    }

    const { bgc, text: textColor } = getColor()

    return (
        <TouchableOpacity onPress={onKeyPress} style={[styles.keys, { backgroundColor: bgc }]} >
            <Text style={ [styles.keys_text, { color: textColor }] }> { Day.date } </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    keys: {
        // borderWidth: 1,
        width: 34,
        height: 34,
        borderRadius: 10,
        marginTop: 4,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    keys_text: {
        fontSize: 16,
        fontWeight: '500'
        // fontFamily: 'Roboto_500Medium'
    }
})

export default Key
