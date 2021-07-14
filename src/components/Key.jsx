import React from 'react'
import { StyleSheet, TouchableOpacity, Text, } from 'react-native'



const Key = ({ eachDay, maxTime, minTime, mode, output, setOutput, haveLimit, displayMonth }) => {
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
    // console.log(JSON.stringify(output))

    // 這邊要改成state控制，之所以字的顏色會先變動再換月份，可能是因為eachDay.month或displayMonth有人先一步變了
    const getColor = () => {
        const yearOfThisKey = eachDay.year
        const monthOfThisKey = eachDay.month
        const dateOfThisKey = eachDay.date
        let timeOfThisKey = new Date(yearOfThisKey, monthOfThisKey, dateOfThisKey).getTime()
        const selected = { bgc: '#4682E9', text: '#fff', }
        const notSelected = { bgc: '#fff', text: '#000', }
        const disabled = { bgc: '#fff', text: '#aaa', }
        if (eachDay.currentMonth === false) {
            selected.bgc = '#C8DAF8'
            notSelected.text = '#eee'
            disabled.text = '#eee'
        }
        if (eachDay.disable) return disabled
        if (mode === 'single') {
            const thisDateIsSelected = timeOfThisKey === output.date.getTime()
            if (thisDateIsSelected) return selected
            return notSelected
        }
        if (mode === 'range') {
            if (!output.endDate) {
                if (timeOfThisKey === output.startDate?.getTime()) return selected
                else return notSelected
            } else {
                if (timeOfThisKey >= output.startDate?.getTime() & timeOfThisKey <= output.endDate.getTime()) return selected
                else return notSelected
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