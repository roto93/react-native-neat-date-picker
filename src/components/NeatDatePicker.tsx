import React from "react"
import { Mode, Output } from './Key'
import Modal from 'react-native-modal'
import { i18nLanguages } from '../lib/lib'
import { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, Platform, I18nManager, ColorValue, ViewStyle } from 'react-native'
import Content from "./Content"
import useDaysOfMonth from "../hooks/useDaysOfMonth"
import format from '../dateformat'
import { NeatDatePickerProps } from "./NeatDatePicker.d"

I18nManager.allowRTL(false)
/**
 * Change window height to screen height due to an issue in android.
 * 
 * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
 */
const winY = Dimensions.get('screen').height

const NeatDatePicker = ({
    colorOptions, dateStringFormat,
    endDate, initialDate,
    isVisible, language,
    maxDate, minDate,
    modalStyles, mode,
    onBackButtonPress, onBackdropPress,
    onCancel, onConfirm,
    startDate,
    chooseYearFirst,
    withoutModal
}: NeatDatePickerProps) => {

    // displayTime defines which month is going to be shown onto the screen
    // For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
    const [displayTime, setDisplayTime] = useState(initialDate ?? new Date())
    const year = displayTime.getFullYear()
    const month = displayTime.getMonth()// 0-base
    const date = displayTime.getDate()
    const TODAY = new Date(year, month, date)

    // output decides which date should be active.
    const [output, setOutput] = useState<Output>(
        mode === 'single'
            ? { date: TODAY, startDate: null, endDate: null }
            : { date: null, startDate: startDate || null, endDate: endDate || null }
    )

    // If user presses cancel, reset 'output' state to this 'originalOutput'
    const [originalOutput, setOriginalOutput] = useState(output)

    const minTime = minDate?.getTime()
    const maxTime = maxDate?.getTime()

    // useDaysOfMonth returns an array that having several objects,
    //  representing all the days that are going to be rendered on screen.
    // Each object contains five properties, 'year', 'month', 'date', 'isCurrentMonth' and 'disabled'.
    const daysArray = useDaysOfMonth(year, month, minTime, maxTime)

    const onCancelPress = () => {
        onCancel()
        setTimeout(() => {
            // reset output to originalOutput
            setOutput(originalOutput)

            // originalOutput.startDate will be null only when the user hasn't picked any date using RANGE DatePicker.
            // If that's the case, don't reset displayTime to originalOutput but initialDate/new Date()
            if (mode === 'range' && !originalOutput.startDate) return setDisplayTime(initialDate || new Date())

            // reset displayTime
            return (mode === 'single')
                ? setDisplayTime(originalOutput.date as Date)
                : setDisplayTime(originalOutput.startDate as Date)
        }, 300)
    }

    const autoCompleteEndDate = () => {
        // set endDate to startDate
        output.endDate = output.startDate

        // After successfully passing arguments in onConfirm, in next life cycle set endDate to null.
        // Therefore, next time when user opens DatePicker he can start from selecting endDate.
        setOutput({ ...output, endDate: null })
    }

    const onConfirmPress = () => {
        if (mode === 'single') {
            const dateString = format(output.date as Date, dateStringFormat)
            const newOutput = {
                ...output,
                dateString,
                startDate: null,
                startDateString: null,
                endDate: null,
                endDateString: null
            }
            onConfirm(newOutput)
        } else {
            // If have not selected any date, just to onCancel
            if (mode === 'range' && !output.startDate) return onCancel()

            //  If have not selected endDate, set it same as startDate
            if (!output.endDate) autoCompleteEndDate()
            const startDateString = format(output.startDate as Date, dateStringFormat)
            const endDateString = format(output.endDate as Date, dateStringFormat)
            const newOutput = {
                ...output,
                startDateString,
                endDateString,
                date: null,
                dateString: null
            }
            onConfirm(newOutput)
        }

        // Because the selected dates are confirmed, originalOutput should be updated.
        setOriginalOutput({ ...output })

        // reset displayTime
        setTimeout(() => {
            return (mode === 'single')
                ? setDisplayTime(output.date as Date)
                : setDisplayTime(output.startDate as Date)
        }, 300)
    }

    const [btnDisabled, setBtnDisabled] = useState(false)

    // move to previous month
    const onPrev = () => {
        setBtnDisabled(true)
        setDisplayTime(new Date(year, month - 1, date))
    }

    // move to next month
    const onNext = () => {
        setBtnDisabled(true)
        setDisplayTime(new Date(year, month + 1, date))
    }

    // Disable Prev & Next buttons for a while after pressing them.
    // Otherwise if the user presses the button rapidly in a short time
    // the switching delay of the calendar is not neglectable
    useEffect(() => {
        setTimeout(setBtnDisabled, 300, false)
    }, [btnDisabled])


    useEffect(() => {
        const [y, m, d] = [initialDate?.getFullYear(), initialDate?.getMonth(), initialDate?.getDate()]
        const updatedInitalDate = initialDate && new Date(y, m, d)

        const newOutput = mode === 'single'
            ? { date: updatedInitalDate ?? TODAY, startDate: null, endDate: null }
            : { date: null, startDate: updatedInitalDate ?? startDate ?? TODAY, endDate: endDate || null }

        setOutput(newOutput)
        setOriginalOutput({ ...newOutput })
    }, [mode, initialDate])


    if (withoutModal) return (
        <Content
            {...{
                language, mode,
                onPrev, onNext,
                onConfirmPress, onCancelPress,
                colorOptions, chooseYearFirst,
                daysArray, btnDisabled,
                displayTime, setDisplayTime,
                output, setOutput
            }}
        />
    )
    return (
        <Modal
            isVisible={isVisible}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onBackButtonPress || onCancelPress}
            onBackdropPress={onBackdropPress || onCancelPress}
            style={[styles.modal, modalStyles]}
            /** This two lines was added to make the modal use all the phone screen height, this is the solucion related to the issue in android:
             * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
             */
            coverScreen={false}
            deviceHeight={winY}
        >
            <Content
                {...{
                    language, mode,
                    onPrev, onNext,
                    onConfirmPress, onCancelPress,
                    colorOptions, chooseYearFirst,
                    daysArray, btnDisabled,
                    displayTime, setDisplayTime,
                    output, setOutput
                }}
            />
        </Modal>
    )
}

NeatDatePicker.defaultProps = {
    dateStringFormat: 'yyyy-mm-dd',
    modalStyles: { justifyContent: 'center' }
}

export default NeatDatePicker


const styles = StyleSheet.create({
    modal: {
        flex: Platform.OS === 'web' ? 1 : 0,
        height: winY,
        alignItems: 'center',
        padding: 0,
        margin: 0
    }
})
