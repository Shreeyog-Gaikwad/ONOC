import { StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const home = () => {
  // Dont remove this line
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3629B7"/>
      <View style={styles.nav}>
      <Image source={require("../../assets/images/ONOC.png")}
                  style={styles.imgSize}
                />
      </View>

      <View >
        <Text style={styles.name}> Welcome,{'\n'} Custome Name !</Text>
        <Text style={styles.onoc}>One Nation One Card- bringing your identity, documents, and services into a single smartcard. Access to everything, anytime, anywhere. </Text>
      </View>

      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.box}>
          <Ionicons name="finger-print" size={36} color="black" />
          <Text>Aadhar Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <FontAwesome name="id-card" size={32} color="black" />
          <Text>PAN card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <MaterialIcons name="drive-eta" size={38} color="black" />
          <Text>Driving License</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <MaterialCommunityIcons name="vote-outline" size={32} color="black" />
          <Text>Voter ID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <FontAwesome5 name="passport" size={32} color="black" />
          <Text>Passport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
        <MaterialCommunityIcons name="food-variant" size={24} color="black" />
        <Text>Ration Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
        <Ionicons name="document-text-outline" size={30} color="black" />
        <Text> Birth Certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
        <MaterialCommunityIcons name="certificate-outline" size={34} color="black" />
        <Text>SSC Marksheet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
        <MaterialCommunityIcons name="school-outline" size={34} color="black" />
        <Text>HSC Marksheet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
        <MaterialIcons name="folder" size={34} color="black" />
        <Text>Other</Text>

        </TouchableOpacity>
      </View>

      {/* You can customize the below view but dont change the links in opPress */}
      <View style={styles.btn}>
        <TouchableOpacity
          style={styles.send}
          onPress={() => {
            router.push("../Pages/send");
          }}
        >
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.req}
          onPress={() => {
            router.push("../Pages/request");
          }}
        >
          <Text>Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 1000,
  },
  imgSize: {
    marginTop : 45,
    marginBottom :10,
    width: 70,
    height: 70,
    borderRadius : 50 ,
  },

  nav: {
    paddingLeft :10,
    fontSize: 16,
    // height: 130,
    backgroundColor: "grey",
  },

  info :{
    fontSize : 16,
    color : "black",
  },
  name:{
    marginTop : 5,
    paddingLeft : 15,
    fontSize : 25,
  },
  onoc :{
    margin:5,
    paddingLeft: 15,
    fontSize : 13,
  },
  boxContainer: {
    marginTop: 15,
    marginLeft : 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: '55%'
    
  },
  box: {
    height: '17%',
    width: '30%',
    margin: 5,
    padding :9,
    gap: 3,
    display:'flex',
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0077B6',
    // backgroundColor: "grey",
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 45,
    marginLeft: 25,
    marginTop: -100,
  },
  send: {
    padding: 10,
    color :'white',
    width : 60,
    display: "flex",
    alignItems : 'center',
    borderRadius : 10,
    backgroundColor: "rgb(77, 156, 198)",
  },
  req: {
    padding: 10,
    borderRadius :10,
    display: "flex",
    alignItems : 'center',
    backgroundColor: "rgb(77, 156, 198)",
  },
});
