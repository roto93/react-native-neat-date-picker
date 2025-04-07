import { FC, useRef, useEffect, useState, JSX } from 'react'
import {
  ColorValue,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import MDicon from 'react-native-vector-icons/MaterialIcons'

/**
 * The number of years before and after the current year to generate in the year list.
 * For example, if the current year is 2025 and `YEARS_OFFSET` is 25,
 * the list will start from (2025 - 25) = 2000 and go up to (2000 + 49) = 2049.
 */
const YEARS_OFFSET = 25

/**
 * The fixed height (in pixels) of each item (year) in the FlatList.
 * This value is used to calculate the scroll position and for snapping behavior.
 */
const ITEM_HEIGHT = 60

export type ChangeYearModalProps = {
  /**
   * The color of texts, icons and the background color of change year modal.
   * @param primary: The color of texts and icons in change year modal.
   * @param backgroundColor:The background color of change year modal.
   */
  colorOptions: {
    primary: ColorValue
    backgroundColor: ColorValue
  }
  /**
   * the functiont o excute when the modal is closed.
   */
  dismiss: () => void
  // The current date to show in the modal.
  displayTime: Date
  // Prop to know if the modal is visible or not.
  isVisible: boolean

  /**
   * This is a extension from `ModalProps` from `react-native-modal` library.
   * If you want to know more about this prop, please visit:
   *
   * {@link https://github.com/react-native-modal/react-native-modal/blob/master/src/modal.tsx}
   */
  changeYearModalProps?: Omit<ModalProps, 'children'>
  /**
   *  Switch the date picker to the selected year.
   */
  goToDate: (year: number, month: number, date: number) => void
}

/**
 * This is a component to change the year.
 * @param {ChangeYearModalProps.colorOptions} colorOptions - Is an object that receives two keys: `primary` and `backgroundColor`, their values change the color of the texts, icons and background of the modal.
 * @param {ChangeYearModalProps.dismiss} dismiss - Is a function that is executed when the modal is closed.
 * @param {ChangeYearModalProps.displayTime} displayTime - Is the current date to show in the modal.
 * @param {ChangeYearModalProps.isVisible} isVisible - Is a prop to know if the modal is visible or not.
 * @param goToDate Switch the date picker to the selected year, month, and date.
 * @param {ChangeYearModalProps.changeYearModalProps} changeYearModalProps - Is a prop that extends the `ModalProps` from `react-native-modal` library.
 * @returns {JSX.Element} Returns a JSX.Element.
 */
const ChangeYearModal: FC<ChangeYearModalProps> = ({
  colorOptions,
  dismiss,
  displayTime,
  isVisible,
  goToDate,
  changeYearModalProps,
}: ChangeYearModalProps): JSX.Element => {
  const { primary, backgroundColor } = colorOptions
  const currentYear = displayTime.getFullYear()
  const years = Array.from(
    { length: 50 },
    (_, i) => currentYear - YEARS_OFFSET + i,
  )

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const flatListRef = useRef<FlatList>(null)

  const scrollToIndex = (index: number, animated = true) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated,
      viewPosition: 0.5,
    })
  }

  const onDismiss = () => {
    dismiss()
    goToDate(selectedYear, displayTime.getMonth(), displayTime.getDate())
  }

  useEffect(() => {
    if (isVisible) {
      setSelectedYear(currentYear)
      const index = years.findIndex((y) => y === currentYear)
      setTimeout(() => scrollToIndex(index, false), 0)
    }
  }, [isVisible])

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const middleItem = viewableItems[Math.floor(viewableItems.length / 2)]
        if (middleItem?.item) setSelectedYear(middleItem.item)
      }
    },
  ).current

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })

  const changeYearBy = (delta: number) => {
    const newIndex = years.findIndex((y) => y === selectedYear) + delta
    if (newIndex >= 0 && newIndex < years.length) {
      scrollToIndex(newIndex)
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      onBackButtonPress={onDismiss}
      onBackdropPress={onDismiss}
      animationIn='zoomIn'
      animationOut='zoomOut'
      style={styles.modal}
      {...changeYearModalProps}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <TouchableOpacity onPress={() => changeYearBy(-1)} style={styles.btn}>
          <MDicon name='keyboard-arrow-up' size={48} color={primary} />
        </TouchableOpacity>

        <FlatList
          data={years}
          keyExtractor={(item) => item.toString()}
          ref={flatListRef}
          renderItem={({ item }) => (
            <View style={[styles.yearItem, { height: ITEM_HEIGHT }]}>
              <Text
                style={[
                  styles.yearText,
                  {
                    color: item === selectedYear ? primary : '#888',
                    fontSize: item === selectedYear ? 24 : 18,
                    fontWeight: item === selectedYear ? 'bold' : 'normal',
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          )}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate='fast'
          bounces={false}
        />

        <TouchableOpacity onPress={() => changeYearBy(1)} style={styles.btn}>
          <MDicon name='keyboard-arrow-down' size={48} color={primary} />
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
    height: ITEM_HEIGHT * 3 + 48 * 2,
    width: 250,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_text: {
    fontSize: 18,
  },
  yearText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  prevYearText: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  nextYearText: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  yearItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
