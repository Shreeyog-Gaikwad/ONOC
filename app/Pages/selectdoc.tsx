import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const selectdoc = () => {
  const { name, number, image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Select Documents Page</Text>
      <Text>Name : {name}</Text>
      <Text>Number : {number}</Text>
      <Text>{image}</Text>
    </View>
  );
};

export default selectdoc;

const styles = StyleSheet.create({
  container: {
    margin: 50,
  },
});
