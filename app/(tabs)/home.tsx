import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const home = () => {
  return (
    <View>
      <StatusBar backgroundColor="#3629B7" />
      <View style={styles.btn}>
        <TouchableOpacity style={styles.send}>
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.req}>
          <Text>Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginLeft: 20,
    marginTop: 60
  },
  send: {
    padding: 10,
    backgroundColor: 'yellow',
  },
  req: {
    padding: 10,
    backgroundColor: 'yellow',
  }
});
