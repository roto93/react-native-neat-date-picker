import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

const ChangeYearModal = ({ isVisible, dismiss, time, setDisplayDate }) => {
    const [year, setYear] = useState(time.year);
    const onDismiss = () => {
        dismiss()
        let newDate = new Date(year, time.month, time.date)
        setDisplayDate(newDate)
    }

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={onDismiss}
            onBackdropPress={onDismiss}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            style={styles.modal}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev + 1) }}
                    style={styles.btn}
                >
                    <Text style={styles.btn_text}>^</Text>
                </TouchableOpacity>
                <Text style={{ marginVertical: 16, fontSize: 28, }}>{year}</Text>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev - 1) }}
                    style={styles.btn}
                >
                    <Text style={styles.btn_text}>v</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ChangeYearModal

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

    },
    btn: {
        width: 100,
        height: 40,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
    }
})
