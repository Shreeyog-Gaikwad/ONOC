import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import Entypo from '@expo/vector-icons/Entypo';
import { Animated } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const profile = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [currUser, setCurrUser] = useState([])

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(250)).current;

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };



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

  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        console.log("Fetching blob...");
        const response = await fetch(imageUri);
        const blob = await response.blob();
        console.log("Blob fetched:", blob);

        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);

        console.log("Uploading blob...");
        const snapshot = await uploadBytes(storageRef, blob);
        console.log("Upload complete:", snapshot);

        console.log("Getting download URL...");
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);

        const q = query(collection(db, "userinfo"), where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          const userDocRef = doc(db, "userinfo", docId);

          await updateDoc(userDocRef, { profilePic: downloadURL });

          setCurrUser(prev => ({ ...prev, profilePic: downloadURL }));
        }

      } catch (error) {
        console.error("Error uploading or getting download URL:", error);
      }
    }
  };


  return (
    <View style={styles.container}>

      <View style={styles.container1}>
        <Text style={styles.profileName}>PROFILE</Text>
        <TouchableOpacity style={styles.menu} onPress={toggleSidebar}>
          <Entypo name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container2}>
        <View style={styles.userInfoSection}>
          <View style={styles.img}>
            <Image
              source={
                currUser?.profilePic
                  ? { uri: currUser.profilePic }
                  : require("../../assets/images/User.png")
              }
              style={styles.imgSize}
            />
          </View>
          <TouchableOpacity style={styles.edit} onPress={pickAndUploadImage}><Feather name="edit-2" size={18} color="black" /></TouchableOpacity>
          <View style={styles.userContent}>
            <Text style={styles.title}>{currUser?.name}</Text>
            <Text style={styles.caption}>{currUser?.username}</Text>
          </View>
        </View>

        <View style={styles.textsBox}>
          <View style={styles.info}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">Username -: {currUser?.username}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">Email -: {currUser?.email}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">Contact No. -: {currUser?.number}</Text>
          </View>
        </View>

      </View>

      {sidebarVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        >
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sidebarText}>
              <MaterialIcons name="cancel" size={34} color="black" />
            </View>
            <View style={styles.menuWrapper}>
              <TouchableOpacity onPress={() => {router.push('/Pages/about') }}>
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

            <TouchableOpacity onPress={logout}>
              <View style={styles.logout}>
                <Text style={styles.logoutTxt}>Logout</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>


      )}
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3629B7",
  },
  container1: {
    height: "15%",
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 20,
    gap: 120
  },
  container2: {
    paddingTop: 30,
    backgroundColor: "#fff",
    height: "85%",
    width: '100%',
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  profileName: {
    fontSize: 30,
    textAlign: "left",
    fontWeight: "bold",
    color: 'white',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    display: "flex",
    flexDirection: "row",
  },
  img: {
    width: '30%',
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
    margin: 15,
    width: "70%"
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
    marginVertical: 10,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  logoutTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logout: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    marginVertical: 10,
    borderRadius: 15
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
  edit: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -30,
    marginTop: 70,
    borderWidth: 1,
    borderColor: '#c6d4f5'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: 225,
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 11,
  },
  sidebarText: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: 15,
  },
 

});
