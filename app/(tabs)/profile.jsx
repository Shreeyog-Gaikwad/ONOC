import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProfileInfo from "@/components/Profile/profile";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import Feather from '@expo/vector-icons/Feather';


const profile = () => {
  const router = useRouter();

  const user = auth.currentUser;

  const [currUser, setCurrUser] = useState([])

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User Signed Out");
        router.replace("/auth/Login/Login");
      })
      .catch((error) => { });
  };

  const getUserData = async () => {
    const q = query(collection(db, "userinfo"), where("id", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const userInfo = querySnapshot.docs[0].data();
    setCurrUser(userInfo);
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.profileName}>PROFILE</Text>
      </View>
      <View style={styles.userInfoSection}>
        <View>
          <Image
            source={require("../../assets/images/User.png")}
            style={styles.imgSize}
          />
        </View>
        <TouchableOpacity style={styles.edit}><Feather name="edit-2" size={18} color="black" /></TouchableOpacity>
        <View style={styles.userContent}>
          <Text style={styles.title}>{currUser?.name}</Text>
          <Text style={styles.caption}>{currUser?.username}</Text>
        </View>
      </View>

      <View style={styles.textsBox}>
        <View style={styles.info}>
          <Text style={styles.text}>Username -: {currUser?.username}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.text}>Email -: {currUser?.email}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.text}>Contact No. -: {currUser?.number}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableOpacity onPress={() => { }}>
          <View style={styles.menuItems}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="black"
            />
            <Text style={styles.menuText}>About</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View style={styles.menuItems}>
            <Ionicons name="help-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Help</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View style={styles.menuItems}>
            <Ionicons name="settings" size={25} color="black" />
            <Text style={styles.menuText}>Setting</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <View style={styles.logoutSection}>
          <Text >Logout</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    backgroundColor: "#fff",
    flex: 1,
  },
  profileName: {
    fontSize: 25,
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    display: "flex",
    flexDirection: "row",
  },
  imgSize: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    height: 100,
    flexDirection: "row",
    borderBlockColor: "#BEf3ae",
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    padding: 10,
  },
  menuItems: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 26,
  },
  textsBox: {
    padding: 10,
    margin: 5,
    height: 190,
    display: "flex",
    alignItems: 'center'
  },
  logoutSection: {
    margin: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  logout: {
    backgroundColor: "red",
    width: 100,
    height: 50,
    padding: 10,
    marginLeft: 30,
    display: "flex",
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: "center",
  },
  info: {
    height: 60,
    width: '95%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#c6d4f5',
    marginBottom: 10,
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
  edit:{
    backgroundColor:'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -30,
    marginTop: 70,
    borderWidth: 1,
    borderColor: '#c6d4f5'
  }
});
