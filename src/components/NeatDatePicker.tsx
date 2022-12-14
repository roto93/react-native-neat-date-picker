import React from "react"
import Key, { Mode, Output } from './Key'
import format from '../dateformat'
import Modal from 'react-native-modal'
import { getTranslation, i18nLanguages } from '../lib/lib'
import { useState, useEffect } from 'react'
import ChangeYearModal from './ChangeYearModal'
import useDaysOfMonth, { DaysArray } from '../hooks/useDaysOfMonth'
import MDicon from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, Platform, I18nManager, ColorValue, ViewStyle } from 'react-native'

I18nManager.allowRTL(false)
/**
 * Change window height to screen height due to an issue in android.
 * 
 * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
 */
const winY = Dimensions.get('screen').height

export type ColorOptions = {
    /** The background color of date picker and that of change year modal. */
    backgroundColor?: ColorValue;
    /** The background color of header. */
    headerColor?: ColorValue;
    /** The color of texts and icons in header. */
    headerTextColor?: ColorValue;
    /** The color of texts and icons in change year modal. */
    changeYearModalColor?: ColorValue;
    /** The text color of week days (like Monday, Tuesday ...) which shown below header. */
    weekDaysColor?: ColorValue;
    /** The text color of all the displayed date when not being selected.
     *
     * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
    */
    dateTextColor?: ColorValue;
    /** The text color of all the displayed date when being selected.
     *
     * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
    */
    selectedDateTextColor?: ColorValue;
    /** The background color of all the displayed date when being selected.
     *
     * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
    */
    selectedDateBackgroundColor?: ColorValue;
    /** The text color of the confirm Button. */
    confirmButtonColor?: ColorValue;
}

type DateStringOptions = "ddd mmm dd yyyy HH:MM:ss" | "default" | "m/d/yy" | "shortDate" | "mm/dd/yyyy" | "paddedShortDate" | "mmm d, yyyy" | "mediumDate" | "mmmm d, yyyy" | "longDate" | "dddd, mmmm d, yyyy" | "fullDate" | "h:MM TT" | "shortTime" | "h:MM:ss TT" | "mediumTime" | "h:MM:ss TT Z" | "longTime" | "yyyy-mm-dd" | "isoDate" | "HH:MM:ss" | "isoTime" | "yyyy-mm-dd'T'HH:MM:sso" | "isoDateTime" | "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'" | "isoUtcDateTime"| "ddd, dd mmm yyyy HH:MM:ss Z" | "expiresHeaderFormat"

export type NeatDatePickerProps = {
    /**
     * The colorOptions prop contains several color settings. It helps you customize the date picker.
     *
     * @default { backgroundColor: '#ffffff',
     * headerColor: '#4682E9',
     * headerTextColor: '#ffffff',
     * changeYearModalColor: '#4682E9',
     * weekDaysColor: '#4682E9',
     * dateTextColor: '#000000',
     * selectedDateTextColor: '#ffffff',
     * selectedDateBackgroundColor: '#4682E9',
     * confirmButtonColor: '#4682E9'
     * }
     */
    colorOptions?: ColorOptions;
    /**
     * Specify the format of dateString. e.g.'yyyyMMdd', 'dd-MM-yyyy'
     *
     * @borrows This property use dateFormat library. you can find more information here: https://github.com/felixge/node-dateformat#mask-options but you can only use the mask part.
     */
    dateStringFormat?: DateStringOptions;
    /**
     * Set this prop to a date if you need to set a limit date when opening the date picker the first time. Only works with 'range' mode.
     */
    endDate?: Date;
    /**
     * When it is the first time that the user open this date picker, it will show the month which initialDate is in.
     */
    initialDate?: Date;
    /**
     * Show/hide the date picker modal
     *
     * @required
     */
    isVisible: boolean;
    /**
     * Avaliable languages:
     *
     * @enum 'en' | 'cn' | 'de' | 'es' | 'fr' | 'pt'
     */
    language?: i18nLanguages;
    /**
     * The lateset date which is allowed to be selected.
     */
    maxDate?: Date;
    /**
     * The earliest date which is allowed to be selected.
     */
    minDate?: Date;
    /**
     * Customized the modal styles.
     *
     * @type Object
     */
    modalStyles?: ViewStyle;
    /**
     * Set the type of date picker selection.
     *
     * @enum 'single' | 'range'
     * @required
     */
    mode: Mode;
    /**
     * A callback function which will be called when the Android back button is pressed.
     */
    onBackButtonPress?: () => void;
    /**
     * A callback function which will be called when the backdrop is pressed.
     */
    onBackdropPress?: () => void;
    /**
     * This callback will execute when user presses cancel button.
     *
     * @required
     */
    onCancel: () => void;
    /**
     * This callback will execute when user presses confirm button.
     *
     * this prop passes an argument `output` For 'single' mode, output contains two properties `date`, `dateString`.
     * As for 'range' mode, it contains four properties `startDate`, `startDateString`, `endDate` and `endDateString`
     *
     * @example
     * #### single mode:
     *
     * ```ts
     * const onConfirm = ({ date: Date, dateString: string }) => {
     *   console.log(date.getTime())
     *   console.log(dateString)
     * }
     * ```
     *
     * #### range mode:
     *
     * ```ts
     * const onConfirm = (output) => {
     *   const {startDate, startDateString, endDate, endDateString} = output
     *   console.log(startDate.getTime())
     *   console.log(startDateString)
     *   console.log(endDate.getTime())
     *   console.log(endDateString)
     * }
     * ```
     *
     * @required
     */
    onConfirm: (arg: Object) => void;
    /**
     * Set this prop to a date if you need to set an initial starting date when opening the date picker the first time. Only works with 'range' mode.
     */
    startDate?: Date;
}

const NeatDatePicker = ({
    colorOptions, dateStringFormat,
    endDate, initialDate,
    isVisible, language,
    maxDate, minDate,
    modalStyles, mode,
    onBackButtonPress, onBackdropPress,
    onCancel, onConfirm,
    startDate
}: NeatDatePickerProps) => {
    const [showChangeYearModal, setShowChangeYearModal] = useState(false)
    const sevenDays = language
        ? getTranslation(language).weekDays
        : getTranslation('en').weekDays

    // displayTime defines which month is going to be shown onto the screen
    // For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
    const [displayTime, setDisplayTime] = useState(initialDate || new Date())
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

    // destructure colorOptions
    const {
        backgroundColor,
        headerColor,
        headerTextColor,
        changeYearModalColor,
        weekDaysColor,
        dateTextColor,
        selectedDateTextColor,
        selectedDateBackgroundColor,
        confirmButtonColor
    } = { ...defaultColorOptions, ...colorOptions }

    useEffect(() => {
        setOutput(mode === 'single'
            ? { date: TODAY, startDate: null, endDate: null }
            : { date: null, startDate: startDate || null, endDate: endDate || null })
    }, [mode])
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
            <View style={[styles.container, { backgroundColor }]}>
                <View style={[styles.header, { backgroundColor: headerColor }]}>

                    {/* last month */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-left'} size={32} color={headerTextColor} />
                    </TouchableOpacity>

                    {/* displayed year and month */}
                    <TouchableOpacity onPress={() => { setShowChangeYearModal(true) }}>
                        <Text style={[styles.header__title, { color: headerTextColor }]}>
                            {daysArray.length !== 0 && daysArray[10].year + ' '}
                            {daysArray.length !== 0 && (language ? (getTranslation(language).months as any)[daysArray[10].month] : (getTranslation('en').months as any)[daysArray[10].month])}
                        </Text>
                    </TouchableOpacity>

                    {/* next month */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onNext} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-right'} size={32} color={headerTextColor} />
                    </TouchableOpacity>
                </View>

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
                    {daysArray.map((Day: DaysArray, i: number) => (
                        <Key key={Day.year.toString() + Day.month.toString() + i.toString()}
                            Day={Day}
                            mode={mode}
                            output={output}
                            setOutput={setOutput}
                            colorOptions={{
                                dateTextColor,
                                backgroundColor,
                                selectedDateTextColor,
                                selectedDateBackgroundColor
                            }}
                        />
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>
                                {language ? getTranslation(language).cancel : getTranslation('en').cancel}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: confirmButtonColor }]}>
                                {language ? getTranslation(language).accept : getTranslation('en').accept}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeYearModal
                    isVisible={showChangeYearModal}
                    dismiss={() => { setShowChangeYearModal(false) }}
                    displayTime={displayTime}
                    setDisplayTime={setDisplayTime}
                    colorOptions={{
                        primary: changeYearModalColor,
                        backgroundColor
                    }}
                />
            </View>
        </Modal>
    )
}

NeatDatePicker.defaultProps = {
    dateStringFormat: 'yyyy-mm-dd',
    modalStyles: { justifyContent: 'center' }
}

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
    confirmButtonColor: '#4682E9'
}

export default NeatDatePicker

const styles = StyleSheet.create({
    modal: {
        flex: Platform.OS === 'web' ? 1 : 0,
        height: winY,
        alignItems: 'center',
        padding: 0,
        margin: 0
    },
    container: {
        width: 328,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 68,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    header__title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '500'
    },
    keys_container: {
        width: 300,
        height: 264,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    weekDays: {
        fontSize: 16
    },
    keys: {
        width: 34,
        height: 30,
        borderRadius: 10,
        marginTop: 4,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        width: 300,
        height: 52,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btn_box: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        justifyContent: 'space-between'
    },
    btn: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_text: {
        fontSize: 18,
        color: '#777'
    },
    changeMonthTO: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        padding: 4,
        borderColor: 'black'
    }
})
