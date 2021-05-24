import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyDatePicker from './src/components/MyDatePicker';

export default function App() {
    const [RangeDatePickerOpen, setRangeDatePickerOpen] = useState(false);
    const [singleDatePickerOpen, setSingleDatePickerOpen] = useState(false);
    const [selectedRangeDate, setSelectedRangeDate] = useState('');
    const [selectedSingleDate, setSelectedSingleDate] = useState('');
    return (
        <View style={styles.container}>
            <MyDatePicker
                isVisible={RangeDatePickerOpen}
                setIsVisible={setRangeDatePickerOpen}
                mode={'range'}
                minDate={new Date(2021, 3, 3)}
                maxDate={new Date(2021, 4, 23)}
                // displayDate={new Date(2019, 1, 14)} //選填
                onConfirm={(start, end) => { setSelectedRangeDate(`${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}號~${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}號`) }}
            />
            <TouchableOpacity
                onPress={() => { setRangeDatePickerOpen(true) }}
                style={styles.TO}>
                <Text style={styles.t}>{selectedRangeDate ? selectedRangeDate : '選擇多個日期'}</Text>
            </TouchableOpacity>



            <MyDatePicker
                isVisible={singleDatePickerOpen}
                setIsVisible={setSingleDatePickerOpen}
                mode={'single'}
                minDate={new Date(2021, 4, 3)}
                maxDate={new Date(2021, 4, 23)}
                // displayDate={new Date(2019, 1, 14)} //選填
                onConfirm={(date) => { setSelectedSingleDate(`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}號`) }}
            />
            <TouchableOpacity
                onPress={() => { setSingleDatePickerOpen(true) }}
                style={styles.TO}>
                <Text style={styles.t}>{selectedSingleDate ? selectedSingleDate : '選擇單一日期'}</Text>
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
