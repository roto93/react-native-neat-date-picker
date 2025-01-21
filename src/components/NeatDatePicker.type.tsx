import { ColorValue, ViewStyle } from 'react-native'
import { i18nLanguageConfig, i18nLanguageKey } from '../lib/lib'

export type Mode = 'single' | 'range'

export type Day = {
  year: number
  month: number
  date: number
  isCurrentMonth: boolean
  disabled: boolean
}

export type ColorOptions = {
  /** The background color of date picker and that of change year modal. */
  backgroundColor?: ColorValue

  /** The background color of header. */
  headerColor?: ColorValue

  /** The color of texts and icons in header. */
  headerTextColor?: ColorValue

  /** The text color of week days (like Monday, Tuesday ...) which shown below header. */
  weekDaysColor?: ColorValue

  /** The text color of all the displayed date when not being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
   */
  dateTextColor?: ColorValue

  /** The text color of all the displayed date when being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
   */
  selectedDateTextColor?: ColorValue

  /** The background color of all the displayed date when being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
   */
  selectedDateBackgroundColor?: ColorValue

  /** The text color of the confirm Button. */
  confirmButtonColor?: ColorValue

  /** The color of texts and icons in change year modal. */
  changeYearModalColor?: ColorValue
}

export type NeatDatePickerCommonProps = {
  /**
   * Show or hide the date picker modal.
   *
   * @required
   */
  isVisible: boolean

  /**
   * Sets the initial date displayed on the first open.
   */
  initialDate?: Date

  /**
   * Specifies the latest selectable date.
   */
  maxDate?: Date

  /**
   * Specifies the earliest selectable date.
   */
  minDate?: Date

  /**
   * Custom styles for the modal.
   *
   * @type Object
   */
  modalStyles?: ViewStyle

  /**
   * Built in language sets.
   */
  language?: i18nLanguageKey

  /**
   * Custom language config.
   */
  customLanguageConfig?: i18nLanguageConfig

  /**
   * The colorOptions prop contains several color settings. It helps you customize the date picker.
   *
   * @default { backgroundColor: '#ffffff',
   * headerColor: '#4682E9',
   * headerTextColor: '#ffffff',
   * changeYearModalColor: '#4682E9',
   * weekDaysColor: '#4682E9',
   * dateTextColor: '#000000',
   * selectedDateTextColor: '#ffffff',
   * selectedDateBackgroundColor: '#4682E9',
   * confirmButtonColor: '#4682E9'
   * }
   */
  colorOptions?: ColorOptions

  /**
   * If true, the date picker will be displayed directly instead of being placed in a modal.
   */
  withoutModal?: boolean

  /**
   * Set this prop to `true` if you want to pop up the year modal first. This will force the user to select the year before selecting the date.
   */
  chooseYearFirst?: boolean

  /**
   * Specify the format of dateString. e.g.'yyyyMMdd', 'dd-MM-yyyy'
   *
   * @borrows This property use dateFormat library. you can find more information here: https://github.com/felixge/node-dateformat#mask-options but you can only use the mask part.
   */
  dateStringFormat?: string

  /**
   * This callback will execute when user presses cancel button.
   *
   * @required
   */
  onCancel: () => void

  /**
   * A callback function which will be called when the backdrop is pressed.
   */
  onBackdropPress?: () => void

  /**
   * A callback function which will be called when the Android back button is pressed.
   */
  onBackButtonPress?: () => void
}

export type NeatSingleDatePickerProps = NeatDatePickerCommonProps & {
  /**
   * Set the type of date picker selection.
   *
   * @enum 'single' | 'range'
   * @required
   */
  mode: 'single'

  /**
   * This callback will execute when user presses confirm button.
   *
   * this prop passes an argument `output` For 'single' mode, output contains two properties `date`, `dateString`.
   * As for 'range' mode, it contains four properties `startDate`, `startDateString`, `endDate` and `endDateString`
   *
   * @example
   * #### single mode:
   *
   * ```ts
   * const onConfirm = ({ date: Date, dateString: string }) => {
   *   console.log(date.getTime())
   *   console.log(dateString)
   * }
   * ```
   *
   * @required
   */
  onConfirm: (output: SingleOutput) => void
}
export type NeatRangeDatePickerProps = NeatDatePickerCommonProps & {
  /**
   * Set the type of date picker selection.
   *
   * @enum 'single' | 'range'
   * @required
   */
  mode: 'range'

  /**
   * Set this prop to a date if you need to set an initial starting date when opening the date picker the first time. Only works with 'range' mode.
   */
  startDate?: Date

  /**
   * Set this prop to a date if you need to set a limit date when opening the date picker the first time. Only works with 'range' mode.
   */
  endDate?: Date

  /**
   * This callback will execute when user presses confirm button.
   *
   * this prop passes an argument `output` For 'single' mode, output contains two properties `date`, `dateString`.
   * As for 'range' mode, it contains four properties `startDate`, `startDateString`, `endDate` and `endDateString`
   *
   * #### range mode:
   *
   * ```ts
   * const onConfirm = (output) => {
   *   const {startDate, startDateString, endDate, endDateString} = output
   *   console.log(startDate.getTime())
   *   console.log(startDateString)
   *   console.log(endDate.getTime())
   *   console.log(endDateString)
   * }
   * ```
   *
   * @required
   */
  onConfirm: (output: RangeOutput) => void
}

export type SingleOutput = {
  date?: Date
  dateString?: string
}

export type RangeOutput = {
  startDate?: Date
  startDateString?: string
  endDate?: Date
  endDateString?: string
}

export type NeatDatePickerProps =
  | NeatSingleDatePickerProps
  | NeatRangeDatePickerProps
