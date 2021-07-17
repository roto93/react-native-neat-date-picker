import React from 'react'
import { StyleSheet, TouchableOpacity, Text, } from 'react-native'

const Key = ({ Day, mode, output, setOutput, colorOptions }) => {

    const { dateTextColor, dateBackgroundColor, selectedDateColor, selectedDateBackgroundColor } = colorOptions

    const onKeyPress = () => {
        if (Day.disabled) return
        if (mode === 'single') {
            const newDate = new Date(Day.year, Day.month, Day.date)
            const newOutPut = { date: newDate, startDate: null, endDate: null, }
            setOutput(newOutPut)
        }
        if (mode === 'range') {
            const newDate = new Date(Day.year, Day.month, Day.date)
            const shouldSetStartDate = !output.startDate || output.endDate || (newDate.getTime() < output.startDate?.getTime())
            if (shouldSetStartDate) {
                // set startDate
                const newOutPut = { date: null, startDate: newDate, endDate: null, }
                setOutput(newOutPut)
            } else {
                // set endDate 
                const newOutPut = { ...output, endDate: newDate }
                setOutput(newOutPut)
            }
        }
    }

    const getColor = () => {

        const selectedColors = { bgc: selectedDateBackgroundColor, text: selectedDateColor, }
        const notSelectedColors = { bgc: dateBackgroundColor, text: dateTextColor, }
        const disabledColors = { bgc: dateBackgroundColor, text: `${dateTextColor}55`, }

        if (Day.currentMonth === false) {
            selectedColors.bgc = `${selectedDateBackgroundColor}22`
            notSelectedColors.text = `${dateTextColor}22`
            disabledColors.text = `${dateTextColor}22`
        }

        const timeOfThisKey = new Date(Day.year, Day.month, Day.date).getTime()

        if (Day.disabled) return disabledColors
        if (mode === 'single') {
            const isThisDateSelected = timeOfThisKey === output.date.getTime()
            return isThisDateSelected ? selectedColors : notSelectedColors
        }
        if (mode === 'range') {
            if (!output.endDate) {
                return timeOfThisKey === output.startDate?.getTime() ? selectedColors : notSelectedColors
            }
            const isThisDayInSelectedRange = timeOfThisKey >= output.startDate?.getTime() && timeOfThisKey <= output.endDate.getTime()
            return isThisDayInSelectedRange ? selectedColors : notSelectedColors
        }
    }

    const { bgc, text: textColor } = getColor()

    return (
        <TouchableOpacity onPress={onKeyPress}
            style={[styles.keys, { backgroundColor: bgc }]}>
            <Text style={[styles.keys_text, { color: textColor, }]}>{Day.date}</Text>
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
        alignItems: 'center',
    },
    keys_text: {
        fontSize: 16,
        fontFamily: 'Roboto_400Regular'
    },
})


export default Key