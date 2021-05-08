import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { getMonthInChinese } from '../lib/lib';


// const data = { days: 26, firstDay: 5, prevMonthDays: 31 }

const MyDatePicker = ({ isVisible, setIsVisible, displayDate: inputDisplayDate, mode }) => {
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [displayDate, setDisplayDate] = useState(inputDisplayDate || new Date());
    const Time = {
        year: displayDate.getFullYear(),
        month: displayDate.getMonth(), // 0-base
        date: displayDate.getDate(),
    }
    const [output, setOutput] = useState({ date: displayDate, startDate: null, endDate: null });

    const data = useDaysOfMonth(displayDate)

    const Key = ({ time }) => {
        let opacity = time.month !== Time.month && 0.25

        const onKeyPress = () => {
            if (mode === 'single') {
                let setTo = {
                    date: new Date(time.year, time.month, time.date),
                    startDate: null,
                    endDate: null,
                }
                setOutput(setTo)
            }
            if (mode === 'range') {
                if (output.startDate === null | output.endDate !== null) {
                    let setTo = {
                        date: null,
                        startDate: new Date(time.year, time.month, time.date),
                        endDate: null,
                    }
                    setOutput(setTo)
                } else {
                    let setTo = {
                        ...output,
                        endDate: new Date(time.year, time.month, time.date)
                    }
                    setOutput(setTo)
                }
            }
        }
        const getBackgroundColor = () => {
            if (mode === 'single') {
                if (time.month === output.date.getMonth() & time.date === output.date.getDate()) return 'skyblue'
                else return 'white'

            }
        }
        return (
            <TouchableOpacity onPress={onKeyPress}
                style={[styles.keys, { opacity: opacity, backgroundColor: getBackgroundColor() }]}>
                <Text style={styles.keys_text}>{time.date}</Text>
            </TouchableOpacity>
        )
    }
    const createKeys = () => {
        let arr = Array.from(Array(data.days), ((_, i) => ({ year: Time.year, month: Time.month, date: i + 1 })))

        let insertingInFrontCount = 1
        let insertingTime = { year: Time.year, month: Time.month - 1, date: (data.prevMonthDays) }

        while (insertingInFrontCount <= data.firstDay) {
            arr.unshift(insertingTime)
            insertingTime = { ...insertingTime, date: (--data.prevMonthDays) }
            insertingInFrontCount++
        }

        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) {
            let insertingTime = { year: Time.year, month: Time.month + 1, date: (i * -1) }
            arr.push(insertingTime); i--
        }
        return arr
    }

    const onCancel = () => { setIsVisible(false); setOutput({ date: new Date(), startDate: null, endDate: null }) }
    const onConfirm = () => { setIsVisible(false) }



    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onCancel}
            onBackdropPress={onCancel}
            style={{ alignItems: 'center', padding: 0, margin: 0 }}
        >
            <View style={styles.modal_container}>

                <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Button title={'prev'} onPress={() => { setDisplayDate(new Date(Time.year, Time.month - 1, Time.date)) }} />
                    <Text>{Time.year}</Text>
                    <Text>{getMonthInChinese(Time.month)}</Text>
                    <Button title={'next'} onPress={() => { setDisplayDate(new Date(Time.year, Time.month + 1, Time.date)) }} />
                </View>

                <View style={styles.keys_container}>
                    {
                        sevenDays.map((n, i) => (
                            <View style={styles.keys} key={i}><Text style={{ color: 'skyblue', fontSize: 16, }}>{n}</Text></View>
                        ))
                    }
                    {
                        createKeys().map((time, i) => (
                            <Key key={i} time={time} />
                        ))
                    }

                </View>
                <View style={styles.footer}>
                    <View style={styles.btn_box}>
                        <TouchableOpacity style={styles.btn} onPress={onCancel}>
                            <Text style={styles.btn_text}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={onConfirm}>
                            <Text style={[styles.btn_text, { color: '#4682E9' }]}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </Modal>
    )
}

MyDatePicker.proptype = {
    isVisible: PropTypes.bool,
    setIsVisible: PropTypes.func,
    text: PropTypes.string,

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
        borderWidth: 1,
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
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

    }
});