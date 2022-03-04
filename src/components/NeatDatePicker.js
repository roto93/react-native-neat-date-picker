import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import MDicon from 'react-native-vector-icons/MaterialIcons';
import useDaysOfMonth from '../hooks/useDaysOfMonth';
import {
  getLongMonthInEnglish,
  getMonthInChinese,
  getMonthInEnglish
} from '../lib/lib';
import ChangeYearModal from './ChangeYearModal';
import Key from './Key';

const winY = Dimensions.get('window').height;

const NeatDatePicker = ({
  isVisible,
  initialDate,
  mode,
  onCancel,
  onConfirm,
  minDate,
  maxDate,
  startDate,
  endDate,
  onBackButtonPress,
  onBackdropPress,
  chinese,
  colorOptions,
  dateStringFormat,
  headerOrder,
  monthLength
}) => {
  const [showChangeYearModal, setShowChangeYearModal] = useState(false);
  const sevenDays = chinese
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // displayTime defines which month is going to be shown onto the screen
  // For 'single' mode, displayTime is also the initial selected date when opening DatePicker at the first time.
  const [displayTime, setDisplayTime] = useState(initialDate || new Date());
  const year = displayTime.getFullYear();
  const month = displayTime.getMonth(); // 0-base
  const date = displayTime.getDate();
  const TODAY = new Date(year, month, date);

  // output decides which date should be active.
  const [output, setOutput] = useState(
    mode === 'single'
      ? { date: TODAY, startDate: null, endDate: null }
      : { date: null, startDate: startDate || null, endDate: endDate || null }
  );

  // If user presses cancel, reset 'output' state to this 'originalOutput'
  const [originalOutput, setOriginalOutput] = useState(output);

  const minTime = minDate?.getTime();
  const maxTime = maxDate?.getTime();

  // useDaysOfMonth returns an array that having several objects,
  //  representing all the days that are going to be rendered on screen.
  // Each object contains five properties, 'year', 'month', 'date', 'isCurrentMonth' and 'disabled'.
  const daysArray = useDaysOfMonth(year, month, minTime, maxTime);

  // monthLength if present with value long we change the length of present month in header to be full length. e.g: January, default is short. eg: Jan
  const [currentMonthLength, setCurrentMonthLength] = useState(
    monthLength || 'short'
  );
  // headerOrder if present with value alternative we change to to be e.g: Jan/January 2022, default is 2022 Jan/January.
  const [currentHeaderOrder, setCurrentHeaderOrder] = useState(
    headerOrder || 'default'
  );

  const onCancelPress = () => {
    onCancel();
    setTimeout(() => {
      // reset output to originalOutput
      setOutput(originalOutput);

      // originalOutput.startDate will be null only when the user hasn't picked any date using RANGE DatePicker.
      // If that's the case, don't reset displayTime to originalOutput but initialDate/new Date()
      if ((mode === 'range') & !originalOutput.startDate)
        return setDisplayTime(initialDate || new Date());

      // reset displayTime
      return mode === 'single'
        ? setDisplayTime(originalOutput.date)
        : setDisplayTime(originalOutput.startDate);
    }, 300);
  };

  const autoCompleteEndDate = () => {
    // set endDate to startDate
    output.endDate = output.startDate;

    // After successfully passing arguments in onConfirm, in next life cycle set endDate to null.
    // Therefore, next time when user opens DatePicker he can start from selecting endDate.
    setOutput({ ...output, endDate: null });
  };

  const onConfirmPress = () => {
    if (mode === 'single') {
      const dateString = output.date.format(dateStringFormat);
      const newOutput = {
        ...output,
        dateString,
        startDate: null,
        startDateString: null,
        endDate: null,
        endDateString: null
      };
      onConfirm(newOutput);
    } else {
      // If have not selected any date, just to onCancel
      if ((mode === 'range') & !output.startDate) return onCancel();

      //  If have not selected endDate, set it same as startDate
      if (!output.endDate) autoCompleteEndDate();
      const startDateString = output.startDate.format(dateStringFormat);
      const endDateString = output.endDate.format(dateStringFormat);
      const newOutput = {
        ...output,
        startDateString,
        endDateString,
        date: null,
        dateString: null
      };
      onConfirm(newOutput);
    }

    // Because the selected dates are confirmed, originalOutput should be updated.
    setOriginalOutput({ ...output });

    // reset displayTime
    setTimeout(() => {
      return mode === 'single'
        ? setDisplayTime(output.date)
        : setDisplayTime(output.startDate);
    }, 300);
  };

  const [btnDisabled, setBtnDisabled] = useState(false);

  // move to previous month
  const onPrev = () => {
    setBtnDisabled(true);
    setDisplayTime(new Date(year, month - 1, date));
  };

  // move to next month
  const onNext = () => {
    setBtnDisabled(true);
    setDisplayTime(new Date(year, month + 1, date));
  };

  // Disable Prev & Next buttons for a while after pressing them.
  // Otherwise if the user presses the button rapidly in a short time
  // the switching delay of the calendar is not neglectable
  useEffect(() => {
    setTimeout(setBtnDisabled, 300, false);
  }, [btnDisabled]);

  // destructure colorOptions
  const {
    backgroundColor,
    headerColor,
    headerTextColor,
    changeYearModalColor,
    weekDaysColor,
    dateTextColor,
    selectedDateTextColor,
    selectedDateBackgroundColor,
    confirmButtonColor
  } = { ...defaultColorOptions, ...colorOptions };

  useEffect(() => {
    setOutput(
      mode === 'single'
        ? { date: TODAY, startDate: null, endDate: null }
        : { date: null, startDate: startDate || null, endDate: endDate || null }
    );
  }, [mode]);

  // const [isFontsLoaded] = useFonts({
  //     Roboto_100Thin,
  //     Roboto_300Light,
  //     Roboto_400Regular,
  //     Roboto_500Medium,
  //     Roboto_700Bold,
  // })
  // if (!isFontsLoaded) return null
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      useNativeDriver
      hideModalContentWhileAnimating
      onBackButtonPress={onBackButtonPress || onCancelPress}
      onBackdropPress={onBackdropPress || onCancelPress}
      style={styles.modal}
    >
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          {/* last month */}
          <TouchableOpacity
            style={styles.changeMonthTO}
            onPress={onPrev}
            disabled={btnDisabled}
          >
            <MDicon
              name={'keyboard-arrow-left'}
              size={32}
              color={headerTextColor}
            />
          </TouchableOpacity>

          {/* displayed year and month */}
          <TouchableOpacity
            onPress={() => {
              setShowChangeYearModal(true);
            }}
          >
            {currentHeaderOrder === 'alternative' ? (
              <Text style={[styles.header__title, { color: headerTextColor }]}>
                {daysArray.length !== 0 &&
                  (chinese
                    ? getMonthInChinese(daysArray[10].month)
                    : currentMonthLength === 'short'
                    ? getMonthInEnglish(daysArray[10].month)
                    : getLongMonthInEnglish(daysArray[10].month))}
                {daysArray.length !== 0 && daysArray[10].year + ' '}
              </Text>
            ) : (
              <Text style={[styles.header__title, { color: headerTextColor }]}>
                {daysArray.length !== 0 && daysArray[10].year + ' '}
                {daysArray.length !== 0 &&
                  (chinese
                    ? getMonthInChinese(daysArray[10].month)
                    : currentMonthLength === 'short'
                    ? getMonthInEnglish(daysArray[10].month)
                    : getLongMonthInEnglish(daysArray[10].month))}
              </Text>
            )}
          </TouchableOpacity>

          {/* next month */}
          <TouchableOpacity
            style={styles.changeMonthTO}
            onPress={onNext}
            disabled={btnDisabled}
          >
            <MDicon
              name={'keyboard-arrow-right'}
              size={32}
              color={headerTextColor}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.keys_container}>
          {/* week days  */}
          {sevenDays.map((weekDay, index) => (
            <View style={styles.keys} key={index.toString()}>
              <Text style={[styles.weekDays, { color: weekDaysColor }]}>
                {weekDay}
              </Text>
            </View>
          ))}

          {/* every days */}
          {daysArray.map((Day, i) => (
            <Key
              key={Day.year.toString() + Day.month.toString() + i.toString()}
              Day={Day}
              mode={mode}
              output={output}
              setOutput={setOutput}
              colorOptions={{
                dateTextColor,
                backgroundColor,
                selectedDateTextColor,
                selectedDateBackgroundColor
              }}
            />
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.btn_box}>
            <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
              <Text style={styles.btn_text}>{chinese ? '取消' : 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
              <Text style={[styles.btn_text, { color: confirmButtonColor }]}>
                {chinese ? '確定' : 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ChangeYearModal
          isVisible={showChangeYearModal}
          dismiss={() => {
            setShowChangeYearModal(false);
          }}
          displayTime={displayTime}
          setDisplayTime={setDisplayTime}
          colorOptions={{
            primary: changeYearModalColor,
            backgroundColor
          }}
        />
      </View>
    </Modal>
  );
};

NeatDatePicker.proptype = {
  isVisible: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  dateStringFormat: PropTypes.string
};

NeatDatePicker.defaultProps = {
  dateStringFormat: 'yyyy-MM-dd'
};

// Notice: only six-digit HEX values are allowed.
const defaultColorOptions = {
  backgroundColor: '#ffffff',
  headerColor: '#4682E9',
  headerTextColor: '#ffffff',
  changeYearModalColor: '#4682E9',
  weekDaysColor: '#4682E9',
  dateTextColor: '#000000',
  selectedDateTextColor: '#ffffff',
  selectedDateBackgroundColor: '#4682E9',
  confirmButtonColor: '#4682E9'
};

export default NeatDatePicker;

const styles = StyleSheet.create({
  modal: {
    flex: Platform.OS == 'web' ? 1 : 0,
    height: winY,
    alignItems: 'center',
    padding: 0,
    margin: 0
  },
  container: {
    width: 328,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden'
  },
  header: {
    // borderWidth: 1,
    flexDirection: 'row',
    width: '100%',
    height: 68,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  header__title: {
    // borderWidth: 1,
    fontSize: 24,
    color: '#fff',
    fontWeight: '500'
    // fontFamily: 'Roboto_500Medium'
  },
  keys_container: {
    // borderWidth: 1,
    width: 300,
    height: 264,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  weekDays: {
    fontSize: 16
    // fontFamily: 'Roboto_400Regular'
  },
  keys: {
    // borderWidth: 1,
    width: 34,
    height: 30,
    borderRadius: 10,
    marginTop: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    // borderWidth: 1,
    width: '100%',
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  btn_box: {
    // borderWidth: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  btn: {
    // borderWidth: 1,
    width: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn_text: {
    fontSize: 18,
    // fontFamily: 'Roboto_400Regular',
    color: '#777'
  },
  changeMonthTO: {
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    padding: 4,
    borderColor: 'black'
  }
});

Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小時
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};
