import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const profile = () => {
  const router = useRouter();

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User Signed Out");
        router.replace("/auth/Login/Login");
      })
      .catch((error) => {});
  };

  return (
    <View>
      <Text>profile</Text>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <View>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  logout: {
    backgroundColor: "red",
    width: 100,
    height: 30,
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
