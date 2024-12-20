import { useEffect, useState } from 'react'
import { Dimensions, I18nManager, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import format from '../dateformat'
import useDaysOfMonth from "../hooks/useDaysOfMonth"
import Content from "./Content"
import { NeatDatePickerProps, RangeOutput, SingleOutput } from "./NeatDatePicker.d"

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
    dateStringFormat ??= 'yyyy-mm-dd'
    modalStyles ??= { justifyContent: 'center' }

    // displayTime defines which month is going to be shown onto the screen
    // For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
    const [displayTime, setDisplayTime] = useState(initialDate ?? new Date())
    const year = displayTime.getFullYear()
    const month = displayTime.getMonth()// 0-base
    const date = displayTime.getDate()
    const TODAY = new Date(year, month, date)

    // output decides which date should be active.
    const [output, setOutput] = useState<SingleOutput | RangeOutput>(
        mode === 'single'
            ? { date: TODAY, startDate: undefined, endDate: undefined }
            : { date: undefined, startDate: startDate || undefined, endDate: endDate || undefined }
    )

    // If user presses cancel, reset 'output' state to this 'originalOutput'
    const [originalOutput, setOriginalOutput] = useState<SingleOutput | RangeOutput>(output)

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
            if (mode === 'range' && !(originalOutput as RangeOutput).startDate) return setDisplayTime(initialDate || new Date())

            // reset displayTime
            return (mode === 'single')
                ? setDisplayTime((originalOutput as SingleOutput).date ?? new Date())
                : setDisplayTime((originalOutput as RangeOutput).startDate ?? new Date())
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
                endDateString: undefined
            }
            onConfirm(newOutput)
        } else {
            // If have not selected any date, just do onCancel
            const RangeOutput = output as RangeOutput
            if (!RangeOutput.startDate) return onCancel()

            //  If have not selected endDate, set it same as startDate
            if (!RangeOutput.endDate) autoCompleteEndDate(RangeOutput)
            const startDateString = format(RangeOutput.startDate as Date, dateStringFormat)
            const endDateString = format(RangeOutput.endDate as Date, dateStringFormat)
            const newOutput = {
                ...RangeOutput,
                startDateString,
                endDateString,
                date: undefined,
                dateString: undefined
            }
            onConfirm(newOutput)
        }

        // Because the selected dates are confirmed, originalOutput should be updated.
        setOriginalOutput({ ...output })

        // reset displayTime
        setTimeout(() => {
            return (mode === 'single')
                ? setDisplayTime((output as SingleOutput).date as Date)
                : setDisplayTime((output as RangeOutput).startDate as Date)
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
        const updatedInitalDate = initialDate && new Date(y!, m!, d!)

        const newOutput = mode === 'single'
            ? { date: updatedInitalDate ?? TODAY, startDate: undefined, endDate: undefined }
            : { date: undefined, startDate: updatedInitalDate ?? startDate ?? TODAY, endDate: endDate }

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


export default NeatDatePicker


const styles = StyleSheet.create({
    modal: {
        flex: 1,
        alignItems: 'center',
        padding: 0,
        margin: 0
    }
})
