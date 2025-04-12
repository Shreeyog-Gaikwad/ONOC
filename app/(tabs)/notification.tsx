import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const notification = () => {
  return (
    <View>
      <StatusBar backgroundColor="#3629B7" />
      <Text>notification</Text>
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({});
