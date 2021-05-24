import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

const months = [
    '一月', '二月', '三月',
    '四月', '五月', '六月',
    '七月', '八月', '九月',
    '十月', '十一月', '十二月',
]

const MonthButton = ({ text, dismiss, year, month, date, setDisplayDate, disabled, setDisabled }) => {

    const onPress = () => {
        setDisabled(true)
        dismiss()
        let newDate = new Date(year, months.indexOf(text), date)
        setDisplayDate(newDate)
    }

    return (
        <TouchableOpacity
            disabled={disabled}
            delayPressIn={0}
            onPress={onPress}
            style={{ width: 50, height: 40, borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}


const ChangeMonthModal = ({ isVisible, dismiss, year, month, date, setDisplayDate }) => {
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        if (isVisible) setDisabled(false)
    }, [isVisible])
    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={dismiss}
            onBackdropPress={dismiss}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            style={styles.modal}
        >
            <View style={styles.container}>
                <FlatList
                    data={months}
                    renderItem={({ item, index }) => (
                        <MonthButton
                            text={item}
                            dismiss={dismiss}
                            year={year} month={month} date={date}
                            setDisplayDate={setDisplayDate}
                            disabled={disabled}
                            setDisabled={setDisabled}
                        />)}
                    keyExtractor={(item) => item}
                    numColumns={3}
                    style={{ width: 220 }}
                    columnWrapperStyle={{ justifyContent: 'space-around' }}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                />
            </View>
        </Modal>
    )
}

export default ChangeMonthModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 250,
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',

    }
})
