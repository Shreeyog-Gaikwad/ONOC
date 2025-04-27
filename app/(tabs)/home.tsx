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
import uploadDoc from "@/app/Pages/uploadDoc";

const home = () => {
  // Dont remove this line
  const router = useRouter();
  const user = auth.currentUser;
  console.log(user);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3629B7" />
      <View style={styles.nav}>
        <Image
          source={require("../../assets/images/ONOC.png")}
          style={styles.imgSize}
        />
        <Text style={styles.onoc}>
          One Nation One Card- bringing your identity, documents,{"\n"} and services
          into a single smartcard.{"\n"} Access to everything, anytime, anywhere.{" "}
        </Text>
      </View>

      <View style={styles.container2}>
        <View style={styles.head}>
          <Text style={styles.name}> Welcome</Text>
          <Text style={styles.name}> {user?.displayName} !</Text>
        </View>

        <View style={styles.boxContainer} >
          <TouchableOpacity style={styles.box} onPress={() => router.push({
            pathname: "/Pages/uploadDoc",
            params: { name: "Aadhar Card" },
          })}>
            <Ionicons name="finger-print" size={36} color="black" />
            <Text style={styles.docText}>Aadhar Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <FontAwesome name="id-card" size={32} color="black" />
            <Text style={styles.docText}>PAN card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialIcons name="drive-eta" size={38} color="black" />
            <Text style={styles.docText}>Driving License</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialCommunityIcons name="vote-outline" size={32} color="black" />
            <Text style={styles.docText}>Voter ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <FontAwesome5 name="passport" size={32} color="black" />
            <Text style={styles.docText}>Passport</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialCommunityIcons name="food-variant" size={24} color="black" />
            <Text style={styles.docText}>Ration Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <Ionicons name="document-text-outline" size={30} color="black" />
            <Text style={styles.docText}> Birth Certificate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialCommunityIcons
              name="certificate-outline"
              size={34}
              color="black"
            />
            <Text style={styles.docText} onPress={() => router.push("/Pages/uploadDoc")}>SSC Marksheet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialCommunityIcons
              name="school-outline"
              size={34}
              color="black"
            />
            <Text style={styles.docText} onPress={() => router.push("/Pages/uploadDoc")}>HSC Marksheet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <Ionicons name="home-outline" size={34} color="black" />

            <Text style={styles.docText}>Domicile Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialCommunityIcons name="badge-account-outline" size={34} color="black" />

            <Text style={styles.docText}>Caste certifcate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => router.push("/Pages/uploadDoc")}>
            <MaterialIcons name="folder" size={34} color="black" />
            <Text style={styles.docText}>Other</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btn}>
          <TouchableOpacity
            style={styles.send}
            onPress={() => {
              router.push("../Pages/send");
            }}
          >
            <Text>Send Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.req}
            onPress={() => {
              router.push("../Pages/request");
            }}
          >
            <Text>Request Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3629B7",
  },
  nav: {
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    height: '15%',
    backgroundColor: "#3629B7",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  imgSize: {
    marginTop: 45,
    marginBottom: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 25,
  },
  onoc: {
    color: "white",
    fontSize: 10,
    paddingRight: 40,
    textAlign: 'left',
    marginTop: 30,
  },
  container2: {
    height: '85%',
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  head : {
    marginTop: 30,
  },
  name: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    paddingLeft: 20,
  },
  boxContainer: {
    marginTop: 15,
    marginLeft: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    height: 100,
    width: "30%",
    margin: 5,
    padding: 9,
    gap: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  docText: {
    textAlign: 'center',
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  send: {
    padding: 10,
    color: "white",
    width: '43%',
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#c6d4f5",
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  req: {
    padding: 10,
    borderRadius: 10,
    width: '43%',
    display: "flex",
    alignItems: "center",
    backgroundColor: "#c6d4f5",
    borderWidth: 2,
    borderColor: "#0077B6",
  },
});
