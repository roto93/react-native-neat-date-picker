# **React Native Neat Date Picker**

An easy-to-use date picker for react native.

<br>

<center>
  <img src="https://i.imgur.com/zYuUh7y.gif" width="200">
</center>

<br>

## **Main Features**

📲 Both Android and iOS devices are supported <br>
👍 Providing range and single selection modes <br>
🕒 Using mordern Date object to manipulate dates.<br>
🌈 Color customization<br>
✨ Clean UI<br>
🈶 Chinese / English / Spanish / German / French / Portuguese

<hr>

## **New Update**
(1.3.0) Updated dependency. No more warning showing up when using Expo. <br>

## **Limitation**

This package is not for web. It is okay to use on web but there might be some problems.

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

## **Basic Usage**

```javascript

import React, { useState } from 'react'
import { StyleSheet, View, Button } from 'react-native'
import DatePicker from 'react-native-neat-date-picker'

const App = () => {

  const [showDatePicker, setShowDatePicker] = useState(false)

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  const onCancel = () => {
    // You should close the modal in here
    setShowDatePicker(false)
  }

  const onConfirm = (output) => {
    // You should close the modal in here
    setShowDatePicker(false)

    // The parameter 'output' is an object containing date and dateString (for single mode).
    // For range mode, the output contains startDate, startDateString, endDate, and EndDateString
    console.log(output.date)
    console.log(output.dateString)

  }

  return (
    <View style={styles.container}>
      <Button title={'open'} onPress={openDatePicker} />
      <DatePicker
        isVisible={showDatePicker}
        mode={'single'}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
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
| `language`          | String   | `en`         | Avaliable languages: 'en', 'cn', 'de', 'es', 'fr', 'pt'.                                                                                                                            |
| `colorOptions`      | Object   | null         | See ColorOptions section.                                                                                                                       |
| `dateStringFormat`  | string   | 'yyyy-MM-dd' | Specify the format of dateString. e.g.'yyyyMMdd', 'dd-MM-yyyy'<br>Availible characters are: <b> y</b> : year, <b>M</b> : month, <b>d</b> : day. |
| `modalStyles`       | Object   | null         | Customized the modal styles. |

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
| selectedDateColor*           | string | The text color of all the displayed date when being selected.                    |
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
- [ ] Turn to typescript.

## **Inspiration**

[react-native-daterange-picker](https://github.com/Naxulanth/react-native-daterange-picker)

<hr>

## **Contact Me**

This is my first open source.<br>
Therefore, I expect there are lots of improvements that could be done.<br>
Any Suggestions or contributions would be very appreciated. <br>
Feel free to contact me by 2roto93Stark@gmail.com.<br>
