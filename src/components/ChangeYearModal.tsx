import React from "react"
import { useState } from 'react'
import { ColorValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import MDicon from 'react-native-vector-icons/MaterialIcons'
import type { Dispatch, SetStateAction, FC } from 'react'


export type ChangeYearModalProps = {
    /**
     * The color of texts, icons and the background color of change year modal.
     * @param primary: The color of texts and icons in change year modal.
     * @param backgroundColor:The background color of change year modal.
     */
    colorOptions: {
        primary: ColorValue;
        backgroundColor: ColorValue;
    };
    /**
     * the functiont o excute when the modal is closed.
     */
    dismiss: () => void;
    // The current date to show in the modal.
    displayTime: Date;
    // Prop to know if the modal is visible or not.
    isVisible: boolean;
    /**
     * Function to change the year.
     */
    setDisplayTime: Dispatch<SetStateAction<Date>>;

    /**
     * This is a extension from `ModalProps` from `react-native-modal` library.
     * If you want to know more about this prop, please visit:
     *
     * {@link https://github.com/react-native-modal/react-native-modal/blob/master/src/modal.tsx}
     */
    changeYearModalProps?: Omit<ModalProps, 'children'>;
}

/**
 * This is a component to change the year.
 * @param {ChangeYearModalProps.colorOptions} colorOptions - Is an object that receives two keys: `primary` and `backgroundColor`, their values change the color of the texts, icons and background of the modal.
 * @param {ChangeYearModalProps.dismiss} dismiss - Is a function that is executed when the modal is closed.
 * @param {ChangeYearModalProps.displayTime} displayTime - Is the current date to show in the modal.
 * @param {ChangeYearModalProps.isVisible} isVisible - Is a prop to know if the modal is visible or not.
 * @param {ChangeYearModalProps.setDisplayTime} setDisplayTime - Is a function to change the year.
 * @param {ChangeYearModalProps.changeYearModalProps} changeYearModalProps - Is a prop that extends the `ModalProps` from `react-native-modal` library.
 * @returns {JSX.Element} Returns a JSX.Element.
 */
const ChangeYearModal: FC<ChangeYearModalProps> = ({ colorOptions, dismiss, displayTime, isVisible, setDisplayTime, changeYearModalProps }: ChangeYearModalProps) => {
    const { primary, backgroundColor } = colorOptions
    const [year, setYear] = useState(displayTime.getFullYear())
    const onDismiss = () => {
        dismiss()
        const newDate = new Date(year, displayTime.getMonth(), displayTime.getDate())
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
            {...changeYearModalProps}
        >
            <View style={[styles.container, { backgroundColor }]}>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev - 1) }}
                    style={styles.btn}
                >
                    <MDicon name={'keyboard-arrow-up'} size={48} color={primary} />
                    <Text style={styles.prevYearText}>{year - 1}</Text>
                </TouchableOpacity>
                <Text style={[styles.yearText, { color: primary }]}>{year}</Text>
                <TouchableOpacity
                    onPress={() => { setYear(prev => prev + 1) }}
                    style={styles.btn}
                >
                    <Text style={styles.nextYearText}>{year + 1}</Text>
                    <MDicon name={'keyboard-arrow-down'} size={48} color={primary} />
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ChangeYearModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: 250,
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        // borderWidth: 1,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_text: {
        fontSize: 18
    },
    yearText: {
        // borderWidth: 1,
        fontSize: 28,
        // fontFamily: 'Roboto_700Bold',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    prevYearText: {
        // borderWidth: 1,
        fontSize: 16,
        // fontFamily: 'Roboto_400Regular',
        color: '#7A7A7A',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4
    },
    nextYearText: {
        // borderWidth: 1,
        fontSize: 16,
        // fontFamily: 'Roboto_400Regular',
        color: '#7A7A7A',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 8
    }
})
