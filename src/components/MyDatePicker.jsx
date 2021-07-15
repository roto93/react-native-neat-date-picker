import React, { useState, useEffect, } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { MaterialIcons as MDicon } from '@expo/vector-icons'
import { getMonthInChinese } from '../lib/lib';
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

const MyDatePicker = ({ isVisible, displayDate, mode, onCancel, onConfirm, minDate, maxDate, startDate, endDate, colorOption }) => {
    const [showChangeYearModal, setShowChangeYearModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [localDisplayDate, setLocalDisplayDate] = useState(displayDate || new Date());
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    const Time = {
        year: localDisplayDate?.getFullYear(),
        month: localDisplayDate?.getMonth(), // 0-base
        date: localDisplayDate?.getDate(),
    }
    const TODAY = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    // output 決定畫面上那些日期要被 active
    const [output, setOutput] = useState(
        mode === 'single'
            ? { date: TODAY, startDate: null, endDate: null }
            : { date: null, startDate: startDate || null, endDate: endDate || null }
    );
    const [originalOutput, setOriginalOutput] = useState(output);

    const haveLimit = typeof minDate === 'object' && typeof maxDate === 'object'
    const minTime = haveLimit && minDate.getTime()
    const maxTime = haveLimit && maxDate.getTime()
    const data = useDaysOfMonth(Time.year || TODAY.getFullYear(), Time.month || TODAY.getMonth(), minTime, maxTime)

    const onCancelPress = () => {
        onCancel() // 關閉視窗

        setTimeout(() => {
            // 把acitve的日期回復成這次打開選擇器之前的樣子
            setOutput(originalOutput)
            // 這次打開選擇器之前如果還沒選過任何日期，originalOutput就是空值，此時就不要把localDisplayDate設成originalOutput
            if (!originalOutput.date & !originalOutput.startDate) return
            if (mode === 'single') {
                // 把顯示的月份恢復成這次打開選擇器之前的樣子
                setLocalDisplayDate(originalOutput.date)
            } else {
                // 把顯示的月份恢復成這次打開選擇器之前的樣子
                setLocalDisplayDate(originalOutput.startDate)
            }
        }, 300);
    }
    const onConfirmPress = () => {

        setTimeout(() => {
            if (mode === 'single') {
                // 下次點擊取消時，顯示的月份要回復成現在所選定的日期的月份
                setLocalDisplayDate(output.date)
            }
            if (mode === 'range') {
                // 如果還沒選結束日
                if (!output.endDate) {
                    // 把開始日和結束日設成一樣的
                    output.endDate = output.startDate
                    // 保持結束日是空值，下次打開選擇器時再繼續
                    setOutput({ ...output, endDate: null })
                }

                // 下次點擊取消時，顯示的月份要回復成現在所選定的日期的第一天的月份
                setLocalDisplayDate(output.startDate)
            }
        }, 300);

        if (mode === 'single') onConfirm(output.date)
        else onConfirm(output.startDate, output.endDate)

        // 下次點擊取消時，active 的日期要回復成現在所選定的狀態
        setOriginalOutput({ ...output })
    }
    const onPrev = () => {
        setBtnDisabled(true)
        setLocalDisplayDate(new Date(Time.year, Time.month - 1, Time.date))
    }
    const onNext = () => {
        setBtnDisabled(true)
        setLocalDisplayDate(new Date(Time.year, Time.month + 1, Time.date))
    }

    // Disable Prev & Next buttons for a while after clicking on them.
    useEffect(() => {
        setTimeout(setBtnDisabled, 300, false)
    }, [btnDisabled, localDisplayDate, minDate, maxDate])


    const {
        headerColor,
        weekDaysColor,
        backgroundColor,
        selectedDayColor,
        confirmButtonColor,
        changeYearModalColor,
    } = colorOption

    console.log(JSON.stringify(output))

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
            onBackButtonPress={onCancelPress}
            onBackdropPress={onCancelPress}
            style={{ alignItems: 'center', flex: 0, height: winY, padding: 0, margin: 0 }}
        >
            <View style={[styles.modal_container, { backgroundColor: backgroundColor, }]}>
                <View style={[styles.header, { backgroundColor: headerColor }]}>

                    {/* 上個月 */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-left'} size={32} color={'#fff'} />
                    </TouchableOpacity>

                    {/* 年月 */}
                    <TouchableOpacity onPress={() => { setShowChangeYearModal(true) }}>
                        <Text style={styles.header__title}>{data[10].year} {getMonthInChinese(data[10].month)}</Text>
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
                    {data.map((eachDay, i) => (
                        <Key key={eachDay.year.toString() + eachDay.month.toString() + i.toString()}
                            eachDay={eachDay}
                            mode={mode}
                            maxTime={maxTime}
                            minTime={minTime}
                            output={output}
                            setOutput={setOutput}
                            haveLimit={haveLimit}
                            displayMonth={Time.month}
                            selectedDayColor={selectedDayColor}
                        />
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: confirmButtonColor }]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeYearModal
                    isVisible={showChangeYearModal}
                    dismiss={() => { setShowChangeYearModal(false) }}
                    time={Time}
                    setDisplayDate={setLocalDisplayDate}
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
    colorOption: {
        headerColor: '#4682E9',
        backgroundColor: '#fff',
        weekDaysColor: '#4682E9',
        selectedDayColor: '#4682E9',
        confirmButtonColor: '#4682E9',
        changeYearModalColor: '#4682E9',
    }
}

export default MyDatePicker

const styles = StyleSheet.create({
    modal_container: {
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
        width: 130,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    btn: {
        width: 54,
        height: 36,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
        // lineHeight: 22,

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