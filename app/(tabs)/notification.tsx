import { StyleSheet, Text, TouchableOpacity, View , Image} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import {GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";
import Notifibox from "@/components/NotifiBox/Notifibox";
import { auth } from "@/config/FirebaseConfig";



const notification = () => {
  const user = auth.currentUser;
  console.log(user);
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#3629B7" />
      <View style={styles.container1}>
          <Image source={require('../../assets/images/User.png')} style={styles.img} />
        <Text style={styles.user}>Hii, {user?.displayName}</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.head}>
          {" "}
          <Ionicons name="notifications" size={30} color="black" />{" "}
          Notifications
        </Text>
        <ScrollView contentContainerStyle={styles.noti}>
            <Notifibox />
            <Notifibox />
            <Notifibox />
            <Notifibox />
            <Notifibox />
            <Notifibox />
            <Notifibox />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3629B7",
  },
  container1: {
    height: "15%",
    display: 'flex',
    flexDirection: 'row',
  },
  image :{
    marginLeft: 30,
    marginTop: 45,
  },
  img: {
    marginLeft: 30,
    marginTop: 45,
    height: 50,
    width: 50,
  },
  user: {
    marginLeft: 15,
    marginTop: 65,
    fontSize: 20,
    color : 'white'
  },
  container2: {
    height: "85%",
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  head: {
    fontSize: 30,
    color: "black",
    marginTop: 30,
    marginBottom: 30,
    fontWeight: "bold",
    paddingLeft: 20,
  },
 
  noti: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
