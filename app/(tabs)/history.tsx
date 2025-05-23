import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HistoryBox from "@/components/HistoryBox/HistoryBox";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { auth, db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const history = () => {
  const user = auth.currentUser;

  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const q = query(
          collection(db, "userinfo"),
          where("id", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const userInfo = querySnapshot.docs[0].data();
        if (userInfo) {
          setProfilePic(userInfo.profilePic);
        }
      }
    };

    fetchUserData();
  }, [user]);
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#3629B7" />
      <View style={styles.container1}>
        <Image
          source={
            profilePic
              ? { uri: profilePic }
              : require("../../assets/images/User.png")
          }
          style={styles.img}
        />
        <Text style={styles.user}>Hii, {user?.displayName}</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.head}>
          {" "}
          <FontAwesome5 name="history" size={30} color="black" /> History
        </Text>
        <FlatList
          data={[1]}
          contentContainerStyle={styles.noti}
          renderItem={() => (
            <>
              <HistoryBox />
            </>
          )}
          keyExtractor={() => "wrapper"}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default history;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3629B7",
  },
  container1: {
    height: "15%",
    display: "flex",
    flexDirection: "row",
  },
  image: {
    marginLeft: 30,
    marginTop: 45,
  },
  img: {
    marginLeft: 30,
    marginTop: 45,
    height: 50,
    width: 50,
    borderRadius: 50
  },
  user: {
    marginLeft: 15,
    marginTop: 65,
    fontSize: 20,
    color: "white",
  },
  container2: {
    height: "85%",
    width: "100%",
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
    justifyContent: "center",
  },
});
