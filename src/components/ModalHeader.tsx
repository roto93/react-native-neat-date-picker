import { Dispatch, FC, SetStateAction } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MDicon from 'react-native-vector-icons/MaterialIcons'
import { i18nLanguageConfig } from '../lib/lib'
import { ColorOptions, Day } from './NeatDatePicker.type'

interface Prop {
  days: Day[]
  colors: ColorOptions
  translation: i18nLanguageConfig
  canGoPreviousMonth: boolean
  canGoNextMonth: boolean
  toPrevMonth: () => void
  toNextMonth: () => void
  openYearModal: Dispatch<SetStateAction<boolean>>
}

const ModalHeader: FC<Prop> = ({
  days,
  colors,
  translation,
  canGoPreviousMonth,
  canGoNextMonth,
  toPrevMonth,
  toNextMonth,
  openYearModal,
}) => {
  const { headerColor, headerTextColor } = colors
  return (
    <View style={[styles.header, { backgroundColor: headerColor }]}>
      {/* last month */}
      <TouchableOpacity
        style={[
          styles.changeMonthTO,
          { opacity: canGoPreviousMonth ? 1 : 0.3 },
        ]}
        disabled={!canGoPreviousMonth}
        onPress={toPrevMonth}
      >
        <MDicon
          name={'keyboard-arrow-left'}
          size={32}
          color={headerTextColor}
        />
      </TouchableOpacity>

      {/* displayed year and month */}
      <TouchableOpacity onPress={() => openYearModal(true)}>
        <Text style={[styles.header__title, { color: headerTextColor }]}>
          {days.length !== 0 && days[10].year + ' '}
          {
            days.length !== 0 &&
              translation?.months[days[10].month as unknown as '0'] // badly supress type error
          }
        </Text>
      </TouchableOpacity>

      {/* next month */}
      <TouchableOpacity
        style={[styles.changeMonthTO, { opacity: canGoNextMonth ? 1 : 0.3 }]}
        disabled={!canGoNextMonth}
        onPress={toNextMonth}
      >
        <MDicon
          name={'keyboard-arrow-right'}
          size={32}
          color={headerTextColor}
        />
      </TouchableOpacity>
    </View>
  )
}

export default ModalHeader

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 68,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header__title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '500',
  },
  changeMonthTO: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    padding: 4,
    borderColor: 'black',
  },
})
