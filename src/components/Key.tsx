import { memo, type FC } from 'react'
import {
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Day } from './NeatDatePicker.type'

type KeyProps = {
  Day: Day
  bgc: ColorValue
  textColor: ColorValue
  onKeyPress: (day: Day) => void
}

const Key: FC<KeyProps> = ({ Day, bgc, textColor, onKeyPress }: KeyProps) => {
  return (
    <TouchableOpacity onPress={() => onKeyPress(Day)} style={styles.pressArea}>
      <View style={[styles.keys, { backgroundColor: bgc }]}>
        <Text style={[styles.keys_text, { color: textColor }]}>
          {' '}
          {Day.date}{' '}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pressArea: {
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  keys: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keys_text: {
    fontSize: 16,
    fontWeight: '500',
    // fontFamily: 'Roboto_500Medium'
  },
})

export default memo(Key)
