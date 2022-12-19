# **React Native Neat Date Picker**

An easy-to-use date picker for react native.

<br>

<center>
  <img src="https://user-images.githubusercontent.com/49035439/191889993-f248be17-4a6f-44ac-b905-07f4596b76af.gif" width="200">
</center>

<br>

## **Main Features**

📲 Both Android and iOS devices are supported <br>
👍 Providing range and single selection modes <br>
🕒 Using mordern Date object to manipulate dates.<br>
🌈 Color customization<br>
✨ Clean UI<br>
🌐 Chinese / English / Spanish / German / French / Portuguese / malagasy

<hr>

## **New Update**
(1.3.0) Updated dependency. No more warning showing up when using Expo. <br>
(1.4.0) Added Typescript support (will update README in the future). Many thanks to [diecodev](https://github.com/diecodev).<br>
(1.4.6) `dateStringFormat` rule changed (**m** for month, used to be **M**)<br>
(1.4.9) New prop: `chooseYearFirst`

## **Limitation**

This package is **NOT** for react-native-web. It is okay to use on web but there might be some problems.

If you're using Expo, It is recommanded to use this date picker package with SDK 45 because `react-native-modal` v13.0 is compatible with `react-native` >= 0.65.

## **Dependencies**

No need to manually install dependencies.

<hr>

## **How to Start**

First install

```
npm i react-native-neat-date-picker
```

## **Import**

```javascript

import DatePicker from 'react-native-neat-date-picker'

```

## **Example**

```javascript

import React, { useState } from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import DatePicker from 'react-native-neat-date-picker'

const App = () => {
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false)
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);

  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const openDatePickerSingle = () => setShowDatePickerSingle(true)
  const openDatePickerRange = () => setShowDatePickerRange(true)

  const onCancelSingle = () => {
    // You should close the modal in here
    setShowDatePickerSingle(false)
  }

  const onConfirmSingle = (output) => {
    // You should close the modal in here
    setShowDatePickerSingle(false)

    // The parameter 'output' is an object containing date and dateString (for single mode).
    // For range mode, the output contains startDate, startDateString, endDate, and EndDateString
    console.log(output)
    setDate(output.dateString)
  }

  const onCancelRange = () => {
    setShowDatePickerRange(false)
  }

  const onConfirmRange = (output) => {
    setShowDatePickerRange(false)
    setStartDate(output.startDateString)
    setEndDate(output.endDateString)
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
    alignItems: 'center'
  }
})

```

## **Properties**

| Property            | Type     | Default      | Discription                                                                                                                                     |
| ------------------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------  |
| `isVisible`         | Boolean  | **REQUIRED** | Show the date picker modal                                                                                                                      |
| `mode`              | String   | **REQUIRED** | 'single' for single date selection. 'range' for date range selection.                                                                           |
| `onCancel`          | Function | **REQUIRED** | This function will execute when user presses cancel button.                                                                                     |
| `onConfirm`         | Function | **REQUIRED** | This function will execute when user presses confirm button. See OnConfirm section.                                                             |
| `initialDate`       | Date     | new Date()   | When it is the first time that the user open this date picker, it will show the month which initialDate is in.                                  |
| `minDate`           | Date     | -            | The earliest date which is allowed to be selected.                                                                                              |
| `maxDate`           | Date     | -            | The lateset date which is allowed to be selected.                                                                                               |
| `startDate`         | Date     | -            | Set this prop to a date if you need to set an initial starting date when opening the date picker the first time. Only works with 'range' mode.  |
| `endDate`           | Date     | -            | Similar to startDate but for ending date.                                                                                                       |
| `onBackButtonPress` | Function | `onCancel`   | Called when the Android back button is pressed.                                                                                                 |
| `onBackdropPress`   | Function | `onCancel`   | Called when the backdrop is pressed.                                                                                                            |
| `language`          | String   | `en`         | Avaliable languages: 'en', 'cn', 'de', 'es', 'fr', 'pt', 'mg'.                                                                                                                            |
| `colorOptions`      | Object   | null         | See ColorOptions section.                                                                                                                       |
| `dateStringFormat`  | string   | 'yyyy-mm-dd' | Specify the format of dateString. e.g.'yyyymmdd', 'dd-mm-yyyy'<br>Availible characters are: <b> y</b> : year, <b>m</b> : month, <b>d</b> : day. |
| `modalStyles`       | Object   | null         | Customized the modal styles. |
| `chooseYearFirst`   | boolean  | false        | Pop up the year modal first. |

## **OnConfirm**
this prop passes an argument `output`
For 'single' mode, output contains two properties `date`, `dateString`.<br>
As for 'range' mode, it contains four properties `startDate`, `startDateString`, `endDate` and `endDateString`<br>

Example:

```javascript

// single mode
const onConfirm = ({ date, dateString }) => {
  console.log(date.getTime())
  console.log(dateString)
}

// range mode
const onConfirm = (output) => {
  const {startDate, startDateString, endDate, endDateString} = output
  console.log(startDate.getTime())
  console.log(startDateString)
  console.log(endDate.getTime())
  console.log(endDateString)
}

...

<DatePicker
  onConfirm={onConfirm}
/>

```

## **ColorOptions**

The colorOptions prop contains several color settings.
It helps you customize the date picker.


| Option                       | Type   | discription                                                                      |
| ---------------------------- | ------ | -------------------------------------------------------------------------------- |
| backgroundColor              | String | The background color of date picker and that of change year modal.               |
| headerColor                  | String | The background color of header.                                                  |
| headerTextColor              | String | The color of texts and icons in header.                                          |
| changeYearModalColor         | string | The color of texts and icons in change year modal.                               |
| weekDaysColor                | string | The text color of week days (like Monday, Tuesday ...) which shown below header. |
| dateTextColor*               | string | The text color of all the displayed date when **not** being selected.            |
| selectedDateTextColor*       | string | The text color of all the displayed date when being selected.                    |
| selectedDateBackgroundColor* | string | The background color of all the displayed date when being selected.              |
| confirmButtonColor           | string | The text color of the confirm Button.                                            |

\* : Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.

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


<hr>

## **TODOs**

- [ ] Add font customization.
- [x] Turn to typescript.

## **Inspiration**

[react-native-daterange-picker](https://github.com/Naxulanth/react-native-daterange-picker)

<hr>

## **Contact Me**

This is my first open source.<br>
Therefore, I expect there are lots of improvements that could be done.<br>
Any suggestions or contributions would be very appreciated. <br>
Feel free to contact me by 2roto93Stark@gmail.com.<br>
