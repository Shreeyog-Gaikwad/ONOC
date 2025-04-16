import { StyleSheet, Text, View } from 'react-native'
import React from 'react';

const ProfileInfo = () =>{
    return (
        <View style={styles.container}>
              <Text style={styles.text}>User information</Text>
            </View>
    )
}

export default ProfileInfo;

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '95%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#c6d4f5',
        marginBottom: 10,
        padding:20,
      },
      text:{
        fontSize: 16,
      }

})