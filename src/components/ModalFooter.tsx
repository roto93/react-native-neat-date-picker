import { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ColorOptions } from 'react-native-neat-date-picker'
import { getTranslation, i18nLanguageKey } from '../lib/lib'

interface Prop {
  colors: ColorOptions
  language?: i18nLanguageKey
  onConfirmPress: () => void
  onCancelPress: () => void
}

const ModalFooter: FC<Prop> = ({
  language,
  colors,
  onConfirmPress,
  onCancelPress,
}) => {
  const { confirmButtonColor } = colors
  return (
    <View style={styles.footer}>
      <View style={styles.btn_box}>
        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
          <Text style={styles.btn_text}>
            {language
              ? getTranslation(language).cancel
              : getTranslation('en').cancel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
          <Text style={[styles.btn_text, { color: confirmButtonColor }]}>
            {language
              ? getTranslation(language).accept
              : getTranslation('en').accept}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ModalFooter

const styles = StyleSheet.create({
  footer: {
    width: 300,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn_box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    minWidth: 60,
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_text: {
    fontSize: 18,
    color: '#777',
  },
})
