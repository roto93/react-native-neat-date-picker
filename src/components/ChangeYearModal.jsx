import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { MaterialIcons as MDicon } from '@expo/vector-icons'

const ChangeYearModal = ({ isVisible, dismiss, displayTime, setDisplayTime, primaryColor }) => {
    const [year, setYear] = useState(displayTime.getFullYear());
    const onDismiss = () => {
        dismiss()
        let newDate = new Date(year, displayTime.getMonth(), displayTime.getDate())
        setDisplayTime(newDate)
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
                    onPress={() => { setYear(prev => prev - 1) }}
                    style={styles.btn}
                >
                    <MDicon name={'keyboard-arrow-up'} size={48} color={primaryColor} />
                    <Text style={styles.prevYearText}>{year - 1}</Text>
                </TouchableOpacity>
                <Text style={[styles.yearText, { color: primaryColor, }]}>{year}</Text>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev + 1) }}
                    style={styles.btn}
                >
                    <Text style={styles.nextYearText}>{year + 1}</Text>
                    <MDicon name={'keyboard-arrow-down'} size={48} color={primaryColor} />
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
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        // borderWidth: 1,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
    },
    yearText: {
        // borderWidth: 1,
        fontSize: 28,
        fontFamily: 'Roboto_700Bold',
        textAlign: 'center',
    },
    prevYearText: {
        // borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
        color: '#7A7A7A',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    nextYearText: {
        // borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
        color: '#7A7A7A',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 8,
    }
})
