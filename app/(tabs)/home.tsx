import { StyleSheet, Text, TouchableOpacity, View, Image, Button } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Upload from "@/app/Pages/upload";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { auth } from "@/config/FirebaseConfig";
import { push } from "expo-router/build/global-state/routing";


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
          One Nation One Card- bringing your identity, documents,{"\n"} and
          services into a single smartcard.{"\n"} Access to everything, anytime,
          anywhere.{" "}
        </Text>
      </View>

      <View>
        <Text style={styles.name}>
          {" "}
          Welcome,{"\n"} {user?.displayName} !
        </Text>
      </View>

      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push({
            pathname: "/Pages/upload",
            params: { name: "Aadhar Card" },
          })}
        >
          <Ionicons name="finger-print" size={36} color="black" />
          <Text style={styles.docText}>Aadhar Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "PAN Card" },
            })
          }
        >
          <FontAwesome name="id-card" size={32} color="black" />
          <Text style={styles.docText}>PAN card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Driving License" },
            })
          }
        >
          <MaterialIcons name="drive-eta" size={38} color="black" />
          <Text style={styles.docText}>Driving License</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Voter ID" },
            })
          }
        >
          <MaterialCommunityIcons name="vote-outline" size={32} color="black" />
          <Text style={styles.docText}>Voter ID</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Passport" },
            })
          }
        >
          <FontAwesome5 name="passport" size={32} color="black" />
          <Text style={styles.docText}>Passport</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Ration Card" },
            })
          }
        >
          <MaterialCommunityIcons name="food-variant" size={24} color="black" />
          <Text style={styles.docText}>Ration Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Birth Certificate" },
            })
          }
        >
          <Ionicons name="document-text-outline" size={30} color="black" />
          <Text style={styles.docText}> Birth Certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "SSC Marksheet" },
            })
          }
        >
          <MaterialCommunityIcons
            name="certificate-outline"
            size={34}
            color="black"
          />
          <Text
            style={styles.docText}
            onPress={() => router.push({
              pathname: "/Pages/upload",
              params: { name: "SSC Marksheet" },
            })}
          >
            SSC Marksheet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "HSC Marksheet" },
            })
          }
        >
          <MaterialCommunityIcons
            name="school-outline"
            size={34}
            color="black"
          />
          <Text
            style={styles.docText}
            onPress={() => router.push({
              pathname: "/Pages/upload",
              params: { name: "HSC Marksheet" },
            })}
          >
            HSC Marksheet
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Domicile Certificate" },
            })
          }
        >
          <Ionicons name="home-outline" size={34} color="black" />

          <Text style={styles.docText}>Domicile Certificate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Caste Certificate" },
            })
          }
        >
          <MaterialCommunityIcons
            name="badge-account-outline"
            size={34}
            color="black"
          />

          <Text style={styles.docText}>Caste certifcate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            router.push({
              pathname: "/Pages/upload",
              params: { name: "Other" },
            })
          }
        >
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
    marginTop: 45,
    marginBottom: 10,
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 25,
  },

  nav: {
    paddingVertical: 10,
    fontSize: 16,
    width: "100%",
    // height: 130,
    backgroundColor: "#e0b72d",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  info: {
    fontSize: 16,
    color: "black",
  },
  name: {
    marginTop: 5,
    paddingLeft: 15,
    fontSize: 25,
  },
  onoc: {
    fontSize: 10,
    paddingRight: 40,
    textAlign: "left",
    marginTop: 30,
  },
  boxContainer: {
    marginTop: 15,
    marginLeft: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "55%",
  },
  box: {
    height: "18%",
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
    // backgroundColor: "grey",
  },
  docText: {
    textAlign: "center",
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
    color: "white",
    width: 60,
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgb(77, 156, 198)",
  },
  req: {
    padding: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgb(77, 156, 198)",
  },
});
