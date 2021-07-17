import React, { useState, useEffect, } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { MaterialIcons as MDicon } from '@expo/vector-icons'
import { getMonthInChinese, getMonthInEnglish } from '../lib/lib';
import ChangeYearModal from './ChangeYearModal';
import {
    useFonts,
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import Key from './Key'

const winY = Dimensions.get('window').height

const MyDatePicker = ({
    isVisible,
    initialDate,
    mode,
    onCancel,
    onConfirm,
    minDate,
    maxDate,
    startDate,
    endDate,
    onBackButtonPress,
    onBackdropPress,
    chinese,
    colorOptions,
}) => {
    const sevenDays = chinese ? ['日', '一', '二', '三', '四', '五', '六'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [showChangeYearModal, setShowChangeYearModal] = useState(false);

    const [displayTime, setDisplayTime] = useState(initialDate || new Date());
    const year = displayTime.getFullYear()
    const month = displayTime.getMonth()// 0-base
    const date = displayTime.getDate()
    const TODAY = new Date(year, month, date)

    // output 決定畫面上哪些日期要被 active
    const [output, setOutput] = useState(
        mode === 'single'
            ? { date: TODAY, startDate: null, endDate: null }
            : { date: null, startDate: startDate || null, endDate: endDate || null }
    );

    // If user presses cancel, reset 'output' state to this 'originalOutput'
    const [originalOutput, setOriginalOutput] = useState(output);

    const minTime = minDate?.getTime()
    const maxTime = maxDate?.getTime()
    const daysArray = useDaysOfMonth(year, month, minTime, maxTime)
    const onCancelPress = () => {
        onCancel() // 關閉視窗

        setTimeout(() => {
            setOutput(originalOutput) // 把acitve的日期回復成這次打開選擇器之前的樣子
            // 這次打開選擇器之前如果還沒選過任何日期，originalOutput就是空值，此時就不要把DisplayTime設成originalOutput
            if (!originalOutput.startDate) return setDisplayTime(initialDate || new Date())
            return (mode === 'single')
                ? setDisplayTime(originalOutput.date) // 把顯示的月份恢復成這次打開選擇器之前的樣子
                : setDisplayTime(originalOutput.startDate) // 把顯示的月份恢復成這次打開選擇器之前的樣子
        }, 300);
    }
    const onConfirmPress = () => {
        if (!output.startDate) return onCancel()
        // 如果還沒選結束日
        if (!output.endDate) {
            output.endDate = output.startDate // 把開始日和結束日設成一樣的
            setOutput({ ...output, endDate: null }) // 保持結束日是空值，下次打開選擇器時再繼續
        }
        if (mode === 'single') onConfirm(output.date)
        else onConfirm(output.startDate, output.endDate)
        setOriginalOutput({ ...output }) // 下次點擊取消時，active 的日期要回復成現在所選定的狀態

        setTimeout(() => {
            return (mode === 'single')
                ? setDisplayTime(output.date) // 下次點擊取消時，顯示的月份要回復成現在所選定的日期的月份
                : setDisplayTime(output.startDate) // 下次點擊取消時，顯示的月份要回復成現在所選定的日期的第一天的月份
        }, 300);
    }

    const [btnDisabled, setBtnDisabled] = useState(false);

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

    // Disable Prev & Next buttons for a while after clicking on them.
    useEffect(() => {
        setTimeout(setBtnDisabled, 300, false)
    }, [btnDisabled])


    const {
        dateTextColor,
        dateBackgroundColor,
        selectedDateColor,
        selectedDateBackgroundColor,
        headerColor,
        weekDaysColor,
        backgroundColor,
        confirmButtonColor,
        changeYearModalColor,
    } = { ...defaultColorOptions, ...colorOptions }

    const [isFontsLoaded] = useFonts({
        Roboto_100Thin,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    })
    if (!isFontsLoaded) return null
    return (
        <Modal
            isVisible={isVisible}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onBackButtonPress || onCancelPress}
            onBackdropPress={onBackdropPress || onCancelPress}
            style={styles.modal}
        >
            <View style={[styles.container, { backgroundColor: backgroundColor, }]}>
                <View style={[styles.header, { backgroundColor: headerColor }]}>

                    {/* 上個月 */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-left'} size={32} color={'#fff'} />
                    </TouchableOpacity>

                    {/* 年月 */}
                    <TouchableOpacity onPress={() => { setShowChangeYearModal(true) }}>
                        <Text style={styles.header__title}>
                            {daysArray[10].year + ' '}
                            {chinese ? getMonthInChinese(daysArray[10].month) : getMonthInEnglish(daysArray[10].month)}
                        </Text>
                    </TouchableOpacity>

                    {/* 下個月 */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onNext} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-right'} size={32} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.keys_container}>

                    {/* week days  */}
                    {sevenDays.map((n, i) => (
                        <View style={styles.keys} key={i}>
                            <Text style={{ color: weekDaysColor, fontSize: 16, fontFamily: 'Roboto_500Medium' }}>
                                {n}
                            </Text>
                        </View>
                    ))}

                    {/* every days */}
                    {daysArray.map((Day, i) => (
                        <Key key={Day.year.toString() + Day.month.toString() + i.toString()}
                            Day={Day}
                            mode={mode}
                            output={output}
                            setOutput={setOutput}
                            colorOptions={{
                                dateTextColor,
                                dateBackgroundColor,
                                selectedDateColor,
                                selectedDateBackgroundColor
                            }}
                        />
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>
                                {chinese ? '取消' : 'Cancel'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: confirmButtonColor }]}>
                                {chinese ? '確定' : 'OK'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeYearModal
                    isVisible={showChangeYearModal}
                    dismiss={() => { setShowChangeYearModal(false) }}
                    displayTime={displayTime}
                    setDisplayTime={setDisplayTime}
                    primaryColor={changeYearModalColor}
                />
            </View>
        </Modal>
    )
}

MyDatePicker.proptype = {
    isVisible: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    onConfirm: PropTypes.func,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,

}

MyDatePicker.defaultProps = {

}

const defaultColorOptions = {
    dateTextColor: '#000000',
    dateBackgroundColor: '#ffffff',
    selectedDateColor: '#ffffff',
    selectedDateBackgroundColor: '#4682E9',
    headerColor: '#4682E9',
    backgroundColor: '#ffffff',
    weekDaysColor: '#4682E9',
    confirmButtonColor: '#4682E9',
    changeYearModalColor: '#4682E9',
}

export default MyDatePicker

const styles = StyleSheet.create({
    modal: {
        flex: 0,
        height: winY,
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    container: {
        width: 328,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden'
    },
    header: {
        // borderWidth: 1,
        flexDirection: 'row',
        width: '100%',
        height: 68,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    header__title: {
        // borderWidth: 1,
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Roboto_500Medium'
    },
    keys_container: {
        // borderWidth: 1,
        width: 300,
        height: 264,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    keys: {
        // borderWidth: 1,
        width: 34,
        height: 30,
        borderRadius: 10,
        marginTop: 4,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        // borderWidth: 1,
        width: '100%',
        height: 52,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn_box: {
        // borderWidth: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    btn: {
        // borderWidth: 1,
        width: 80,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
        // lineHeight: 22,
        fontFamily: 'Roboto_400Regular'

    },
    changeMonthTO: {
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        padding: 4,
        borderColor: 'black',

    }
});