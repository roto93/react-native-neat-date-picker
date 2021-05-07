import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import { getMonthInChinese } from '../lib/lib';


// const data = { days: 26, firstDay: 5, prevMonthDays: 31 }

const MyDatePicker = ({ isVisible, setIsVisible, displayDate }) => {
    const sevenDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [NOW, setNOW] = useState(displayDate || new Date());
    const now = {
        year: NOW.getFullYear(),
        month: NOW.getMonth(), // 0-base
        date: NOW.getDate(),
    }

    const data = useDaysOfMonth(NOW)


    const Key = ({ dateNumber }) => {
        let opacity = dateNumber < 0 ? 0.3 : 1
        if (dateNumber < 0) { dateNumber = dateNumber * -1 }
        return (
            <TouchableOpacity onPress={() => { }}
                style={[styles.keys, { opacity: opacity }]}>
                <Text style={styles.keys_text}>{dateNumber}</Text>
            </TouchableOpacity>
        )
    }
    const createKeys = () => {
        let arr = Array.from(Array(data.days), ((_, i) => i + 1))

        let insertingInFront = 1
        let insertingDate = data.prevMonthDays * -1
        while (insertingInFront <= data.firstDay) {
            arr.unshift(insertingDate)
            insertingDate++
            insertingInFront++
        }

        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) { arr.push(i); i-- }
        return arr
    }
    const onCancel = () => { setIsVisible(false) }
    const onConfirm = () => { setIsVisible(false) }



    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={() => { setIsVisible(false) }}
            onBackdropPress={() => { setIsVisible(false) }}
            style={{ alignItems: 'center', padding: 0, margin: 0 }}
        >
            <View style={styles.modal_container}>

                <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Button title={'prev'} onPress={() => { setNOW(new Date(now.year, now.month - 1, now.date)) }} />
                    <Text>{now.year}</Text>
                    <Text>{getMonthInChinese(now.month)}</Text>
                    <Button title={'next'} onPress={() => { setNOW(new Date(now.year, now.month + 1, now.date)) }} />
                </View>

                <View style={styles.keys_container}>
                    {
                        sevenDays.map((n, i) => (
                            <View style={styles.keys} key={i}><Text style={{ color: 'skyblue', fontSize: 16, }}>{n}</Text></View>
                        ))
                    }
                    {createKeys().map((day, i) => (
                        <Key key={i} dateNumber={day} />
                    ))}

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