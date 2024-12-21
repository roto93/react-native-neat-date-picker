import { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { i18nLanguageConfig } from '../lib/lib'
import { ColorOptions } from './NeatDatePicker.type'

interface Prop {
  colors: ColorOptions
  translation: i18nLanguageConfig
  onConfirmPress: () => void
  onCancelPress: () => void
}

const ModalFooter: FC<Prop> = ({
  translation,
  colors,
  onConfirmPress,
  onCancelPress,
}) => {
  const { confirmButtonColor } = colors
  return (
    <View style={styles.footer}>
      <View style={styles.btn_box}>
        <TouchableOpacity style={styles.btn} onPress={onCancelPress}>
          <Text style={styles.btn_text}>{translation.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onConfirmPress}>
          <Text style={[styles.btn_text, { color: confirmButtonColor }]}>
            {translation.accept}
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
