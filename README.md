# **React Native Neat Date Picker**

An easy-to-use date picker for React Native.

<br>

<center>
  <img src="https://user-images.githubusercontent.com/49035439/191889993-f248be17-4a6f-44ac-b905-07f4596b76af.gif" width="200">
</center>

<br>

## **Main Features**

📲 Supports both Android and iOS devices. <br>
👍 Provides range and single selection modes. <br>
🕒 Utilizes modern Date object for date manipulation.<br>
🌈 Offers color customization.<br>
✨ Clean UI<br>
🌐 Supports multiple languages by default: Chinese, English, Spanish, German, French, Portuguese, Malagasy, and Vietnamese. You can also add any language by yourself.

## **New Update**
(v1.5.0) Supports custom languages. Improves performance and accessibility. <br>

## **Limitation**

This package is **NOT** designed for react-native-web. It can work on the web but may have issues.

For Expo users, it is recommended to use SDK 45 since `react-native-modal` v13.0 is compatible with `react-native` >= 0.65.

## **Dependencies**

No manual dependency installation required.

## **Installation**

```bash
npm i react-native-neat-date-picker
```

## **Example**

```javascript

import { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker'


const App = () => {
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false)
  const [showDatePickerRange, setShowDatePickerRange] = useState(false)

  const [date, setDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const openDatePickerSingle = () => setShowDatePickerSingle(true)
  const openDatePickerRange = () => setShowDatePickerRange(true)

  const onCancelSingle = () => {
    // You should close the modal here
    setShowDatePickerSingle(false)
  }

  const onConfirmSingle = (output: SingleOutput) => {
    // You should close the modal here
    setShowDatePickerSingle(false)

    // The parameter 'output' is an object containing date and dateString (for single mode).
    // For range mode, the output contains startDate, startDateString, endDate, and endDateString
    console.log(output)
    setDate(output.dateString ?? '')
  }

  const onCancelRange = () => {
    setShowDatePickerRange(false)
  }

  const onConfirmRange = (output: RangeOutput) => {
    setShowDatePickerRange(false)
    setStartDate(output.startDateString ?? '')
    setEndDate(output.endDateString ?? '')
  }

  return (
    <View style={styles.container}>
      {/* Single Date */}
      <Button title={'single'} onPress={openDatePickerSingle} />
      <DatePicker
        isVisible={showDatePickerSingle}
        mode={'single'}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
      />
      <Text>{date}</Text>

      {/* Date Range */}
      <Button title={'range'} onPress={openDatePickerRange} />
      <DatePicker
        isVisible={showDatePickerRange}
        mode={'range'}
        onCancel={onCancelRange}
        onConfirm={onConfirmRange}
      />
      <Text>{startDate && `${startDate} ~ ${endDate}`}</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})


```

## **Properties**

| Property            | Type       | Default      | Discription                                                                                                                                     |
| ------------------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------  |
| `isVisible`           | Boolean  | **REQUIRED** | Show or hide the date picker modal.|
| `mode`                | String   | **REQUIRED** | `single` for single date selection or `range` for date range selection.|
| `onCancel`            | Function | **REQUIRED** | Executed when the cancel button is pressed.|
| `onConfirm`           | Function | **REQUIRED** | Executed when the confirm button is pressed. See [onConfirm](#onConfirm).|
| `initialDate`         | Date     | `new Date()` | Sets the initial date displayed on the first open.|
| `minDate`             | Date     | -            | Specifies the earliest selectable date.|
| `maxDate`             | Date     | -            | Specifies the latest selectable date.|
| `startDate`           | Date     | -            | Initial start date for range mode.|
| `endDate`             | Date     | -            | Initial end date for range mode.|
| `onBackButtonPress`   | Function | `onCancel`   | Triggered when the Android back button is pressed.|
| `onBackdropPress`     | Function | `onCancel`   | Triggered when the backdrop is pressed.|
| `language`            | String   | `en`         | Supported languages out of the box: 'en', 'cn', 'de', 'es', 'fr', 'pt', 'mg', 'vi'.|
| `customLanguageConfig`| Object   | -            | Custom language config. See [Customize language](#customizelanguage)|
| `colorOptions`        | Object   | null         | See [ColorOptions](#colorOptions).|
| `dateStringFormat`    | string   | 'yyyy-mm-dd' | Format for date strings. e.g.'yyyymmdd', 'dd-mm-yyyy'<br>Availible characters are: <b> y</b> : year, <b>m</b> : month, <b>d</b> : day. |
| `modalStyles`         | Object   | null         | Custom styles for the modal. |
| `chooseYearFirst`     | boolean  | false        | Opens the year selection modal first. |
| `withoutModal`        | boolean  | false        | If true, the date picker will be displayed directly instead of being placed in a modal. |

## <a name="onConfirm"></a>**`onConfirm`**

The `onConfirm` prop provides an `output` object.

- Single mode: `{ date, dateString }`

- Range mode: `{ startDate, startDateString, endDate, endDateString }`

Example:

```javascript
// Single mode
const handleConfirm = ({ date, dateString }) => {
  console.log(date.getTime());
  console.log(dateString);
};

// Range mode
const handleConfirm = ({ startDate, startDateString, endDate, endDateString }) => {
  console.log(startDate.getTime());
  console.log(startDateString);
  console.log(endDate.getTime());
  console.log(endDateString);
};

...

<DatePicker onConfirm={handleConfirm} />

```

## <a name="customizelanguage"></a>**Customize Language**

Example:

```javascript
{
  months: {
    '0': 'Jan',
    '1': 'Feb',
    '2': 'Mar',
    '3': 'Apr',
    '4': 'May',
    '5': 'Jun',
    '6': 'Jul',
    '7': 'Aug',
    '8': 'Sep',
    '9': 'Oct',
    '10': 'Nov',
    '11': 'Dec',
  },
  weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  accept: 'OK',
  cancel: 'Cancel',
}
```

## <a name="colorOptions"></a>**ColorOptions**

The colorOptions prop contains several color settings.
It helps you customize the date picker.


| Option                       | Type   | discription                                                                      |
| ---------------------------- | ------ | -------------------------------------------------------------------------------- |
| backgroundColor              | String | Background color of the date picker and year selection modal.|
| headerColor                  | String | Background color of the header.|
| headerTextColor              | String | Text and icon color in the header.|
| changeYearModalColor         | string | Text and icon color in the year selection modal.|
| weekDaysColor                | string | Text color for weekday labels (e.g., Monday, Tuesday).|
| dateTextColor*               | string | Text color for unselected dates.|
| selectedDateTextColor*       | string | Text color for selected dates.|
| selectedDateBackgroundColor* | string | Background color for selected dates.|
| confirmButtonColor           | string | Text color of the confirm button.|

\* : Only six-digits HEX code colors (like #ffffff. #fff won't work) are supported because I do something like this behind the scene.

```javascript
style={{color:'{dateTextColor}22'}}  // '#rrggbbaa'
```

Example:

```javascript
const colorOptions = {
  headerColor:'#9DD9D2',
  backgroundColor:'#FFF8F0'
}
...
<DatePicker
  ...
  colorOptions={colorOptions}
/>

```


## **TODOs**

- [ ] Add font customization.
- [x] Turn to typescript.

## **Inspiration**

Inspired by [react-native-daterange-picker](https://github.com/Naxulanth/react-native-daterange-picker).

## **Contact Me**

This is my first open-source project.

Feedback and contributions are welcome!

Email: 2roto93Stark@gmail.com
