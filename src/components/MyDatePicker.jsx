import React, { useState, useEffect, memo } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { MaterialIcons as MDicon } from '@expo/vector-icons'
import { getMonthInChinese, dateFormat } from '../lib/lib';
import ChangeYearModal from './ChangeYearModal';
import ChangeMonthModal from '../components/ChangeMonthModal'
import {
    useFonts,
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto'

const MyDatePicker = ({ isVisible, displayDate, mode, onCancel, onConfirm, minDate, maxDate }) => {
    const [showChangeMonthModal, setShowChangeMonthModal] = useState(false);
    const [showChangeYearModal, setShowChangeYearModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [localDisplayDate, setLocalDisplayDate] = useState(displayDate || new Date());

    const Time = {
        year: localDisplayDate.getFullYear(),
        month: localDisplayDate.getMonth(), // 0-base
        date: localDisplayDate.getDate(),
    }
    // output 決定畫面上那些日期要被active
    const [output, setOutput] = useState(
        mode === 'single'
            ? { date: localDisplayDate, startDate: null, endDate: null }
            : { date: null, startDate: localDisplayDate, endDate: null }
    );
    const [originalOutput, setOriginalOutput] = useState(output);

    const haveLimit = typeof minDate === 'object' && typeof maxDate === 'object'
    const minTime = haveLimit && minDate.getTime()
    const maxTime = haveLimit && maxDate.getTime()
    const data = useDaysOfMonth(Time.year, Time.month, minTime, maxTime)

    const Key = memo(({ eachDay }) => {
        const onKeyPress = () => {
            if (eachDay.disable) return
            if (mode === 'single') {
                const newDate = new Date(eachDay.year, eachDay.month, eachDay.date)
                let newOutPut = {
                    date: newDate,
                    startDate: null,
                    endDate: null,
                }
                const isInDateLimit = newDate.getTime() <= maxTime && newDate.getTime() >= minTime
                if (!haveLimit) setOutput(newOutPut)
                else if (isInDateLimit) setOutput(newOutPut)

            }
            if (mode === 'range') {
                if (eachDay.disable) return
                const newDate = new Date(eachDay.year, eachDay.month, eachDay.date)
                if (haveLimit) {
                    // 如果endDate已經有值了 或點擊的日期比startDate還早
                    const shouldSetStartDate = output.endDate || (newDate.getTime() < output.startDate.getTime())
                    if (shouldSetStartDate) {
                        // set startDate
                        let newOutPut = {
                            date: null,
                            startDate: newDate,
                            endDate: null,
                        }
                        setOutput(newOutPut)
                    } else {
                        // set endDate
                        let newOutPut = {
                            ...output,
                            endDate: newDate
                        }
                        setOutput(newOutPut)
                    }
                } else if (output.endDate) {
                    // set startDate
                    let newOutPut = {
                        date: null,
                        startDate: newDate,
                        endDate: null,
                    }
                    setOutput(newOutPut)
                } else {
                    // set endDate
                    let newOutPut = {
                        ...output,
                        endDate: newDate
                    }
                    setOutput(newOutPut)
                }
            }
        }
        const getBackgroundColor = () => {
            const yearOfThisKey = eachDay.year
            const monthOfThisKey = eachDay.month
            const dateOfThisKey = eachDay.date
            if (mode === 'single') {
                const thisDateIsSelected = monthOfThisKey === output.date.getMonth() && dateOfThisKey === output.date.getDate()
                if (thisDateIsSelected) return 'skyblue'
                return 'white'
            }
            if (mode === 'range') {
                let timeOfThisKey = new Date(yearOfThisKey, monthOfThisKey, dateOfThisKey).getTime()
                if (!output.endDate) {
                    if (timeOfThisKey === output.startDate.getTime()) return 'skyblue'
                    else return 'white'
                } else {
                    if (timeOfThisKey >= output.startDate.getTime() & timeOfThisKey <= output.endDate.getTime()) return 'skyblue'
                    else return 'white'
                }
            }
        }
        return (
            <TouchableOpacity onPress={onKeyPress}
                style={[styles.keys, { backgroundColor: getBackgroundColor() }]}>
                <Text style={[styles.keys_text, { opacity: eachDay.disable ? 0.25 : 1, }]}>{eachDay.date}</Text>
            </TouchableOpacity>
        )
    })
    const onCancelPress = () => {
        // 把acitve的日期回復成這次打開選擇器之前的樣子
        setOutput(originalOutput)
        if (mode === 'single') {
            // 把顯示的月份恢復成這次打開選擇器之前的樣子
            setLocalDisplayDate(originalOutput.date)

        } else {
            // 把顯示的月份恢復成這次打開選擇器之前的樣子
            setLocalDisplayDate(originalOutput.startDate)

        }
        // 關閉視窗
        onCancel()
    }
    const onConfirmPress = () => {
        if (mode === 'single') {
            onConfirm(output.date)
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
            // 把開始日跟結束日傳出去
            onConfirm(output.startDate, output.endDate)
            // 下次點擊取消時，顯示的月份要回復成現在所選定的日期的第一天的月份
            setLocalDisplayDate(output.startDate)
        }
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

    // // Update localDisplayDate if re-open this modal.
    // useEffect(() => {
    //     if (isVisible) {
    //         setOriginalOutput(output)
    //         setLocalDisplayDate(displayDate || new Date())
    //     }
    // }, [isVisible])

    // Disable Prev & Next buttons for a while after clicking on them.
    useEffect(() => {
        setTimeout(setBtnDisabled, 200, false)
    }, [btnDisabled, localDisplayDate, minDate, maxDate])



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
            style={{ alignItems: 'center', padding: 0, margin: 0 }}
        >
            <View style={styles.modal_container}>
                <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignItems: 'center', }}>

                    {/* 上個月 */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onPrev} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-left'} size={32} />
                    </TouchableOpacity>

                    {/* 年月 */}
                    <TouchableOpacity onPress={() => { setShowChangeYearModal(true) }}>
                        <Text style={{ fontSize: 18 }}>{Time.year}</Text>
                        <Text style={{ fontSize: 18 }}>{getMonthInChinese(Time.month)}</Text>
                    </TouchableOpacity>

                    {/* 下個月 */}
                    <TouchableOpacity style={styles.changeMonthTO} onPress={onNext} disabled={btnDisabled} >
                        <MDicon name={'keyboard-arrow-right'} size={32} />
                    </TouchableOpacity>
                </View>

                <View style={styles.keys_container}>

                    {/* week days  */}
                    {sevenDays.map((n, i) => (
                        <View style={styles.keys} key={i}>
                            <Text style={{ color: 'skyblue', fontSize: 16, }}>
                                {n}
                            </Text>
                        </View>
                    ))}

                    {/* every days */}
                    {data.dateArray.map((eachDay, i) => (
                        <Key key={i} eachDay={eachDay} />
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
                            <Text style={styles.btn_text}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
                            <Text style={[styles.btn_text, { color: '#4682E9' }]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ChangeMonthModal
                    isVisible={showChangeMonthModal}
                    dismiss={() => { setShowChangeMonthModal(false) }}
                    time={Time}
                    setDisplayDate={setLocalDisplayDate}
                />
                <ChangeYearModal
                    isVisible={showChangeYearModal}
                    dismiss={() => { setShowChangeYearModal(false) }}
                    time={Time}
                    setDisplayDate={setLocalDisplayDate}
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

export default MyDatePicker

const styles = StyleSheet.create({
    modal_container: {
        width: '100%',
        paddingTop: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_container: {
        // borderWidth: 1,
        width: 300,
        height: 300,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    keys: {
        // borderWidth: 1,
        width: 36,
        height: 36,
        borderRadius: 10,
        marginTop: 4,
        marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keys_text: {
        fontSize: 16,
        fontFamily: 'Roboto_300Light'
    },
    footer: {
        borderWidth: 1,
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
        borderWidth: 1,
        alignItems: 'center',
        width: 50,
        padding: 4,
        borderColor: 'black',

    }
});