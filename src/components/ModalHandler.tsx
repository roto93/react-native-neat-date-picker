import { FC, ReactNode } from 'react'
import { Dimensions, StyleSheet, ViewStyle } from 'react-native'
import Modal from 'react-native-modal'

/**
 * Change window height to screen height due to an issue in android.
 *
 * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
 */
const winY = Dimensions.get('screen').height

interface Prop {
  children: ReactNode
  isVisible: boolean
  withoutModal?: boolean
  modalStyles: ViewStyle
  onBackButtonPress?: () => void
  onBackdropPress?: () => void
  onCancelPress?: () => void
}

const ModalHandler: FC<Prop> = ({
  children,
  isVisible,
  withoutModal,
  modalStyles,
  onBackButtonPress,
  onBackdropPress,
  onCancelPress,
}) => {
  if (withoutModal) return children
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      onBackButtonPress={onBackButtonPress || onCancelPress}
      onBackdropPress={onBackdropPress || onCancelPress}
      style={[styles.modal, modalStyles]}
      /** This two lines was added to make the modal use all the phone screen height, this is the solucion related to the issue in android:
       * @issue https://github.com/react-native-modal/react-native-modal/issues/147#issuecomment-610729725
       */
      coverScreen={false}
      deviceHeight={winY}
    >
      {children}
    </Modal>
  )
}

export default ModalHandler

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
})
