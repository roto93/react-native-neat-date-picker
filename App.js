import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyDatePicker from './src/components/MyDatePicker';

export default function App() {
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateSelected, setDateSelected] = useState('');
    return (
        <View style={styles.container}>
            <MyDatePicker isVisible={datePickerOpen}
                setIsVisible={setDatePickerOpen}
                mode={'single'}
                // displayDate={new Date(2019, 1, 14)}
                onConfirm={(date) => { setDateSelected(`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}號`) }}
            />
            <TouchableOpacity
                onPress={() => { setDatePickerOpen(true) }}
                style={styles.TO}>
                <Text style={styles.t}>{dateSelected ? dateSelected : '選擇日期'}</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TO: {
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    t: {
        fontSize: 20,

    }
});
