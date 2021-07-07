import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { MaterialIcons as MDicon } from '@expo/vector-icons'

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
                    onPress={() => { setYear(prev => prev - 1) }}
                    style={styles.btn}
                >
                    <MDicon name={'keyboard-arrow-up'} size={48} color={'#4682E9'} />
                    <Text style={styles.prevYearText}>{year - 1}</Text>
                </TouchableOpacity>
                <Text style={styles.yearText}>{year}</Text>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev + 1) }}
                    style={styles.btn}
                >
                    <Text style={styles.nextYearText}>{year + 1}</Text>
                    <MDicon name={'keyboard-arrow-down'} size={48} color={'#4682E9'} />
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
        // height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        fontSize: 18,
    },
    yearText: {
        // borderWidth: 1,
        fontSize: 28,
        color: '#4682E9',
        fontFamily: 'Roboto_700Bold',
        textAlign: 'center',
    },
    prevYearText: {
        // borderWidth: 1,
        marginTop: 8,
        marginBottom: 4,
        fontSize: 16,
        color: '#7A7A7A',
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
    },
    nextYearText: {
        // borderWidth: 1,
        marginTop: 4,
        marginBottom: 8,
        fontSize: 16,
        color: '#7A7A7A',
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
    }
})
