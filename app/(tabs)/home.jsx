import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
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
import { auth } from "@/config/FirebaseConfig";

const Home = () => {
  const router = useRouter();
  const user = auth.currentUser;
  console.log(user);

  const documents = [
    { name: "Aadhar Card", icon: <Ionicons name="finger-print" size={36} color="black" /> },
    { name: "PAN Card", icon: <FontAwesome name="id-card" size={32} color="black" /> },
    { name: "Driving License", icon: <MaterialIcons name="drive-eta" size={38} color="black" /> },
    { name: "Voter ID", icon: <MaterialCommunityIcons name="vote-outline" size={32} color="black" /> },
    { name: "Passport", icon: <FontAwesome5 name="passport" size={32} color="black" /> },
    { name: "Ration Card", icon: <MaterialCommunityIcons name="food-variant" size={24} color="black" /> },
    { name: "Birth Certificate", icon: <Ionicons name="document-text-outline" size={30} color="black" /> },
    { name: "SSC Marksheet", icon: <MaterialCommunityIcons name="certificate-outline" size={34} color="black" /> },
    { name: "HSC Marksheet", icon: <MaterialCommunityIcons name="school-outline" size={34} color="black" /> },
    { name: "Domicile Certificate", icon: <Ionicons name="home-outline" size={34} color="black" /> },
    { name: "Caste Certificate", icon: <MaterialCommunityIcons name="badge-account-outline" size={34} color="black" /> },
    { name: "Other", icon: <MaterialIcons name="folder" size={34} color="black" /> },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3629B7" />
      <View style={styles.nav}>
        <Image
          source={require("../../assets/images/ONOC.png")}
          style={styles.imgSize}
        />
        <Text style={styles.onoc}>
          One Nation One Card - bringing your identity, documents,{"\n"}
          and services into a single smartcard.{"\n"}
          Access to everything, anytime, anywhere.
        </Text>
      </View>

      <View style={styles.container2}>
        <View style={styles.head}>
          <Text style={styles.name}>Welcome</Text>
          <Text style={styles.name}>{user?.displayName}!</Text>
        </View>

        <View style={styles.boxContainer}>
          {documents.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => router.push({
                pathname: "/Pages/upload",
                params: { name: doc.name },
              })}
            >
              {doc.icon}
              <Text style={styles.docText}>{doc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.btn}>
          <TouchableOpacity
            style={styles.send}
            onPress={() => router.push("/Pages/send")}
          >
            <Text>Send Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.req}
            onPress={() => router.push("/Pages/request")}
          >
            <Text>Request Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3629B7",
    flex: 1,
  },
  nav: {
    width: '100%',
    height: '15%',
    backgroundColor: "#3629B7",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  imgSize: {
    marginTop: 45,
    marginBottom: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 25,
  },
  onoc: {
    color: "white",
    fontSize: 10,
    paddingRight: 40,
    textAlign: "left",
    marginTop: 30,
  },
  container2: {
    height: '85%',
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 20,
  },
  head: {
    marginTop: 30,
    paddingLeft: 20,
  },
  name: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
  },
  boxContainer: {
    marginTop: 15,
    marginLeft: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    height: 100,
    width: "30%",
    margin: 5,
    padding: 9,
    gap: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  docText: {
    textAlign: "center",
    fontSize: 12,
  },
  btn: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  send: {
    padding: 10,
    backgroundColor: "#c6d4f5",
    borderRadius: 10,
    width: '43%',
    alignItems: "center",
  },
  req: {
    padding: 10,
    backgroundColor: "#c6d4f5",
    borderRadius: 10,
    width: '43%',
    alignItems: "center",
  },
});
