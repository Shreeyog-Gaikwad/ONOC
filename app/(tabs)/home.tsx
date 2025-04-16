import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";


const home = () => {
  // Dont remove this line
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3629B7" />

      {/* You can customize the below view but dont change the links in opPress */}
      <View style={styles.btn}>
        <TouchableOpacity style={styles.send} onPress={()=>{router.push("../Pages/send")}}>
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.req} onPress={()=>{router.push("../Pages/request")}}>
          <Text>Request</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container:{
    backgroundColor: "white",
    height : 1000,
  },

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
