import React from 'react'
import { StyleSheet, TouchableOpacity, Text, } from 'react-native'



const Key = ({ eachDay, maxTime, minTime, mode, output, setOutput, haveLimit, displayMonth, colorOptions }) => {
    const { dateTextColor, dateBackgroundColor, selectedDateColor, selectedDateBackgroundColor } = colorOptions
    const onKeyPress = () => {
        if (eachDay.disable) return
        if (mode === 'single') {
            const newDate = new Date(eachDay.year, eachDay.month, eachDay.date)
            let newOutPut = { date: newDate, startDate: null, endDate: null, }
            const isInDateLimit = newDate.getTime() <= maxTime && newDate.getTime() >= minTime
            if (!haveLimit) setOutput(newOutPut)
            else if (isInDateLimit) setOutput(newOutPut)

        }
        if (mode === 'range') {
            const newDate = new Date(eachDay.year, eachDay.month, eachDay.date)
            const shouldSetStartDate = !output.startDate || output.endDate || (newDate.getTime() < output.startDate?.getTime())
            if (haveLimit) {
                // 如果endDate已經有值了 或點擊的日期比startDate還早
                if (shouldSetStartDate) {
                    // set startDate
                    let newOutPut = { date: null, startDate: newDate, endDate: null, }
                    setOutput(newOutPut)
                } else {
                    // set endDate
                    let newOutPut = { ...output, endDate: newDate }
                    setOutput(newOutPut)
                }
            } else if (shouldSetStartDate) {
                // set startDate
                let newOutPut = { date: null, startDate: newDate, endDate: null, }
                setOutput(newOutPut)
            } else {
                // set endDate 
                let newOutPut = { ...output, endDate: newDate }
                setOutput(newOutPut)
            }
        }
    }

    const getColor = () => {

        const selectedColors = { bgc: selectedDateBackgroundColor, text: selectedDateColor, }
        const notSelectedColors = { bgc: dateBackgroundColor, text: dateTextColor, }
        const disabledColors = { bgc: dateBackgroundColor, text: `${dateTextColor}55`, }
        if (eachDay.currentMonth === false) {
            selectedColors.bgc = `${selectedDateBackgroundColor}22`
            notSelectedColors.text = `${dateTextColor}22`
            disabledColors.text = `${dateTextColor}22`
        }

        const yearOfThisKey = eachDay.year
        const monthOfThisKey = eachDay.month
        const dateOfThisKey = eachDay.date
        const timeOfThisKey = new Date(yearOfThisKey, monthOfThisKey, dateOfThisKey).getTime()

        if (eachDay.disable) return disabledColors
        if (mode === 'single') {
            const thisDateIsSelected = timeOfThisKey === output.date.getTime()
            if (thisDateIsSelected) return selectedColors
            return notSelectedColors
        }
        if (mode === 'range') {
            if (!output.endDate) {
                if (timeOfThisKey === output.startDate?.getTime()) return selectedColors
                return notSelectedColors
            } else {
                if (timeOfThisKey >= output.startDate?.getTime() & timeOfThisKey <= output.endDate.getTime()) return selectedColors
                return notSelectedColors
            }
        }
    }
    const { bgc, text: textColor } = getColor()
    return (
        <TouchableOpacity onPress={onKeyPress}
            style={[styles.keys, { backgroundColor: bgc }]}>
            <Text style={[styles.keys_text, { color: textColor, }]}>{eachDay.date}</Text>
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
        // opacity: 0.2,
    },
    keys_text: {
        fontSize: 16,
        fontFamily: 'Roboto_400Regular'
    },
})


export default Key