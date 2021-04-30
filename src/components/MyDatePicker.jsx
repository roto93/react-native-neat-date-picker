import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import useDaysOfMonth from '../hooks/useDaysOfMonth';


// const data = { days: 26, firstDay: 5, prevMonthDays: 31 }

const MyDatePicker = ({ isVisible, setIsVisible }) => {
    const NOW = new Date('2021-03-16')
    // const now = {
    //     year: NOW.getFullYear(),
    //     month: NOW.getMonth(), // 0-base
    //     date: NOW.getDate(),
    // }
    // console.log('NOW= ' + JSON.stringify(now))


    const data = useDaysOfMonth(NOW)

    const [selectedNum, setSelectedNum] = useState('');

    const Key = ({ selectedNum, dateNumber }) => {
        let color = selectedNum == dateNumber ? 'darkgray' : 'white'
        let opacity = dateNumber < 0 ? 0.3 : 1
        if (dateNumber < 0) { dateNumber = dateNumber * -1 }
        return (
            <View onPress={() => { setSelectedNum(dateNumber) }}
                style={[styles.keys, { backgroundColor: color, opacity: opacity }]}>
                <Text style={styles.keys_text}>{dateNumber}</Text>
            </View>
        )
    }

    const createKeys = () => {
        let insertingInFront = 1
        let insertingDate = data.prevMonthDays * -1

        let arr = Array.from(Array(data.days), ((_, i) => i + 1))
        while (insertingInFront <= data.firstDay) {
            arr.unshift(insertingDate)
            insertingDate++
            insertingInFront++
        }
        let blankInEnd = arr.length % 7 //最後一行剩幾個空格
        if (blankInEnd !== 0) blankInEnd = blankInEnd - 7  //如有餘數則再減七,得到要補的日期數量
        let i = -1
        while (i >= blankInEnd) {
            arr.push(i); i--
        }
        return arr
    }

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={() => { setIsVisible(false) }}
            onBackdropPress={() => { setIsVisible(false) }}
            style={{ alignItems: 'center', }}
        >
            <View style={styles.modal_container}>

                <View style={styles.keys_container}>

                    {createKeys().map((day, i) => (
                        <Key key={i} selectedNum={selectedNum} setSelectedNum={setSelectedNum} dateNumber={day} />
                    ))}

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
        width: 300,
        height: 300,
        backgroundColor: '#fff',
        paddingLeft: 10,
        justifyContent: 'center',
    },
    keys_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    keys: {
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
    }
});