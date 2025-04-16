import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HistoryBox = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.txt}>History Box</Text>
    </View>
  )
}

export default HistoryBox

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#c6d4f5',
    marginBottom: 15,
    padding:20,
  },
  txt:{
    fontSize: 20,
  }

})