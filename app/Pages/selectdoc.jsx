import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const selectdoc = () => {
  const { ...item } = useLocalSearchParams();

  const [selectedDocs, setSelectedDocs] = useState([]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={styles.head1}>Select Documents</Text>
          <Text style={styles.head2}>
            to send <Text style={styles.name}>{item.name} !</Text>
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.boxContainer}>

        </ScrollView>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btntxt}>Send Documents</Text>
        </TouchableOpacity>

      </View>
    </GestureHandlerRootView>
  );
};

export default selectdoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginTop: 50,
    height: '100%',
  },
  head1: {
    fontSize: 35,
    fontWeight: "bold",
  },
  head2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  name: {
    color: "green",
  },
  boxContainer: {
    marginTop: 20,
    height: '85%',
    backgroundColor: 'grey'
  },
  box: {
    height: 90,
    width: "45%",
    margin: 5,
    padding: 9,
    gap: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "black",
  },
  docText: {
    textAlign: "center",
    fontSize: 14,
  },
  btn: {
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#c6d4f5'
  },
  btntxt: {
    fontWeight: 'bold',
  }
});
