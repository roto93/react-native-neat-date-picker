import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'

const date = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
]


const MyDatePicker = ({ isVisible, setIsVisible }) => {
  const [selectedNum, setSelectedNum] = useState('');

  const Key = ({ selectedNum, text }) => {
    let color = selectedNum == text ? 'gray' : 'white'
    return (
      <TouchableOpacity onPress={() => { setSelectedNum(text) }} style={[styles.keys, { backgroundColor: color }]}>
        <Text style={styles.keys_text}>{text}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      hideModalContentWhileAnimating
      onBackButtonPress={() => { setIsVisible(false) }}
      onBackdropPress={() => { setIsVisible(false) }}
      style={{ alignItems: 'center', }}
    >
      <View style={styles.modal_container}>
        {date.map((day, i) => (
          <Key key={i} selectedNum={selectedNum} setSelectedNum={setSelectedNum} text={day} />
        ))}

      </View>
    </Modal>
  )
}

MyDatePicker.proptype = {
  isVisible: PropTypes.bool,
  setIsVisible: PropTypes.func,
  text: PropTypes.string,

}

export default MyDatePicker

const styles = StyleSheet.create({
  modal_container: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  keys: {
    width: 36,
    height: 36,
    borderWidth: 1,
    marginTop: 4,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keys_text: {
    fontSize: 16,
  }
});