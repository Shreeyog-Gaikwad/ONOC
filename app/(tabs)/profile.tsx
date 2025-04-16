import { StyleSheet,Text,TouchableOpacity,View,Image,SafeAreaView } from "react-native";
import React from "react";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProfileInfo from "@/components/Profile/profile";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { IconSymbol } from "@/components/ui/IconSymbol.ios";


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
    <SafeAreaView style={styles.container}>
      <View>
        <Text  style={styles.profileName}>PROFILE</Text>
      </View>
      {/* <StatusBar backgroundColor="#3629B7" />
      <Text>profile</Text> */}
      <View style={styles.userInfoSection}>
        <View>
          <Image
            source={require("../../assets/images/User.png")}
            style={styles.imgSize}
          />
          </View>
          <View style={styles.userContent}>
            <Text style={styles.title}>User name</Text>
            <Text style={styles.caption}>UserID</Text>
          </View>
          </View>

          <View style={styles.textsBox}>
            <ProfileInfo />
            <ProfileInfo />
            <ProfileInfo />
            
          </View>

          <View style={styles.menuWrapper}>
            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.menuItems}>
                <Text style={styles.menuText}>About</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.menuItems}>
                <Text style={styles.menuText}>Help</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.menuItems}>
                <Text style={styles.menuText}>Setting</Text>
              </View>
            </TouchableOpacity>
            
          </View>
          <TouchableOpacity style={styles.logout} onPress={logout}>
          <View style={styles.logoutSection}>
            <Text>Logout</Text>
          </View>
        </TouchableOpacity>
          
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    paddingTop : 70,
    backgroundColor: "#fff",
    flex: 1,
  },
  profileName: {
    fontSize: 25,
    padding : 5,
    textAlign : "center",
    fontWeight : "bold"
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    display : 'flex',
    flexDirection : 'row'
  },
  imgSize: {
    width: 100,
    height: 100,
    borderRadius : 50 ,
  },
  userContent:{
    display : 'flex',
    justifyContent : "center",
    alignItems : "flex-start",
    margin : 10
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
    padding:10,
  },
  menuItems: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 26,
  },
  textsBox:{
    padding : 10,
    margin :5,
    height : 190,
    display : 'flex',
    justifyContent : "space-evenly"
  },
  logoutSection :{
    margin :10,
    display :"flex",
    alignItems : "center",
    justifyContent : "center",
    height : 30,
    
  },
  logout: {
    backgroundColor: "red",
    width: 100,
    height: 50,
    padding:10,
    marginLeft: 30,
    display: "flex",
    justifyContent: "center",
    borderTopLeftRadius : 15,
    borderTopRightRadius :15,
    borderBottomRightRadius : 15,
    borderBottomLeftRadius : 15,
    alignItems : "center"
  },
  
});
