import { ColorValue, ViewStyle } from "react-native";
import { i18nLanguages } from "../lib/lib";
import { Mode } from "./Key";

export type ColorOptions = {
  /** The background color of date picker and that of change year modal. */
  backgroundColor?: ColorValue;
  /** The background color of header. */
  headerColor?: ColorValue;
  /** The color of texts and icons in header. */
  headerTextColor?: ColorValue;
  /** The color of texts and icons in change year modal. */
  changeYearModalColor?: ColorValue;
  /** The text color of week days (like Monday, Tuesday ...) which shown below header. */
  weekDaysColor?: ColorValue;
  /** The text color of all the displayed date when not being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
  */
  dateTextColor?: ColorValue;
  /** The text color of all the displayed date when being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
  */
  selectedDateTextColor?: ColorValue;
  /** The background color of all the displayed date when being selected.
   *
   * @abstract Only six-digits HEX code colors (like #ffffff. #fff won't work) are allowed because I do something like this behind the scene.
  */
  selectedDateBackgroundColor?: ColorValue;
  /** The text color of the confirm Button. */
  confirmButtonColor?: ColorValue;
}

type DateStringOptions = "ddd mmm dd yyyy HH:MM:ss" | "default" | "m/d/yy" | "shortDate" | "mm/dd/yyyy" | "paddedShortDate" | "mmm d, yyyy" | "mediumDate" | "mmmm d, yyyy" | "longDate" | "dddd, mmmm d, yyyy" | "fullDate" | "h:MM TT" | "shortTime" | "h:MM:ss TT" | "mediumTime" | "h:MM:ss TT Z" | "longTime" | "yyyy-mm-dd" | "isoDate" | "HH:MM:ss" | "isoTime" | "yyyy-mm-dd'T'HH:MM:sso" | "isoDateTime" | "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'" | "isoUtcDateTime" | "ddd, dd mmm yyyy HH:MM:ss Z" | "expiresHeaderFormat"

export type NeatDatePickerProps = {
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
  colorOptions?: ColorOptions;
  /**
   * Specify the format of dateString. e.g.'yyyyMMdd', 'dd-MM-yyyy'
   *
   * @borrows This property use dateFormat library. you can find more information here: https://github.com/felixge/node-dateformat#mask-options but you can only use the mask part.
   */
  dateStringFormat?: DateStringOptions;
  /**
   * Set this prop to a date if you need to set a limit date when opening the date picker the first time. Only works with 'range' mode.
   */
  endDate?: Date;
  /**
   * When it is the first time that the user open this date picker, it will show the month which initialDate is in.
   */
  initialDate?: Date;
  /**
   * Show/hide the date picker modal
   *
   * @required
   */
  isVisible: boolean;
  /**
   * Avaliable languages:
   *
   * @enum 'en' | 'cn' | 'de' | 'es' | 'fr' | 'pt'
   */
  language?: i18nLanguages;
  /**
   * The lateset date which is allowed to be selected.
   */
  maxDate?: Date;
  /**
   * The earliest date which is allowed to be selected.
   */
  minDate?: Date;
  /**
   * Customized the modal styles.
   *
   * @type Object
   */
  modalStyles?: ViewStyle;
  /**
   * Set the type of date picker selection.
   *
   * @enum 'single' | 'range'
   * @required
   */
  mode: Mode;
  /**
   * A callback function which will be called when the Android back button is pressed.
   */
  onBackButtonPress?: () => void;
  /**
   * A callback function which will be called when the backdrop is pressed.
   */
  onBackdropPress?: () => void;
  /**
   * This callback will execute when user presses cancel button.
   *
   * @required
   */
  onCancel: () => void;
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
  onConfirm: (arg: Object) => void;
  /**
   * Set this prop to a date if you need to set an initial starting date when opening the date picker the first time. Only works with 'range' mode.
   */
  startDate?: Date;
  /**
   * Set this prop to `true` if you want to pop up the year modal first. This will force the user to select the year before selecting the date.
   */
  chooseYearFirst?: boolean;
  /**
   * If true, the date picker will be displayed directly instead of being placed in a modal.
   */
  withoutModal?: boolean;
}
