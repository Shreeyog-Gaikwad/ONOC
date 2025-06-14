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
import { useState } from "react";
import { db } from "@/config/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";



const Home = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [uploadedDocs, setUploadedDocs] = useState({})
  const [loading, setLoading] = useState(true);

  const documents = [
    { name: "Aadhar Card", lib: Ionicons, iconName: "finger-print", size: 36 },
    { name: "PAN Card", lib: FontAwesome, iconName: "id-card", size: 32 },
    { name: "Driving License", lib: MaterialIcons, iconName: "drive-eta", size: 38 },
    { name: "Voter ID", lib: MaterialCommunityIcons, iconName: "vote-outline", size: 32 },
    { name: "Passport", lib: FontAwesome5, iconName: "passport", size: 32 },
    { name: "Ration Card", lib: MaterialCommunityIcons, iconName: "food-variant", size: 34 },
    { name: "Birth Certificate", lib: Ionicons, iconName: "document-text-outline", size: 30 },
    { name: "SSC Marksheet", lib: MaterialCommunityIcons, iconName: "certificate-outline", size: 34 },
    { name: "HSC Marksheet", lib: MaterialCommunityIcons, iconName: "school-outline", size: 36 },
    { name: "Domicile Certificate", lib: Ionicons, iconName: "home-outline", size: 34 },
    { name: "Caste Certificate", lib: MaterialCommunityIcons, iconName: "badge-account-outline", size: 36 },
    { name: "Other", lib: MaterialIcons, iconName: "folder", size: 34, multiUpload: true },
  ];


  useFocusEffect(
    useCallback(() => {
      const fetchUserDocs = async () => {
        if (!user) return;
        setLoading(true);

        try {
          const q = query(
            collection(db, "userinfo"),
            where("id", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const uploaded = userData.uploadedDocuments || [];

            const statusMap = {};
            documents.forEach((doc) => {
              const isUploaded = uploaded.some(
                (item) => item.name === doc.name
              );
              statusMap[doc.name] = isUploaded;
            });

            setUploadedDocs(statusMap);
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error fetching user documents:", error);
        }

        setLoading(false);
      };

      fetchUserDocs();
    }, [user])
  );


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
          Access to everything, anytime, anywhere.{"\n"}
        </Text>
      </View>

      <View style={styles.container2}>
        <View style={styles.head}>
          <Text style={styles.name}>Welcome</Text>
          <Text style={styles.name}>{user?.displayName}!</Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Checking documents...</Text>
        ) : (
          <View style={styles.boxContainer}>
            {documents.map((doc, index) => {
              const isUploaded = uploadedDocs[doc.name];
              const iconColor = isUploaded ? "green" : "red";
              const Icon = doc.lib;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.box}
                  onPress={() => {
                    if (doc.name === "Other") {
                      router.push({
                        pathname: "/Pages/otherUpload",
                        params: { name: doc.name },
                      });
                    } else {
                      router.push({
                        pathname: "/Pages/upload",
                        params: { name: doc.name },
                      });
                    }
                  }}
                >
                  {doc.name === "Other" ? <Icon name={doc.iconName} size={doc.size} color={"#ffc524"} /> : (
                    <Icon name={doc.iconName} size={doc.size} color={iconColor} />
                  )}

                  <Text style={styles.docText}>{doc.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        )}


        <View style={styles.btn}>
          <TouchableOpacity
            style={styles.send}
            onPress={() => router.push("/Pages/selectMethod")}
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
    fontSize: 11,
    paddingRight: 40,
    textAlign: "left",
    marginTop: 30,
  },
  container2: {
    height: '85%',
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

  },
  head: {
    marginTop: 15,
    paddingLeft: 25,
  },
  name: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
  },
  boxContainer: {
    marginTop: 15,
    marginLeft: 10,
    padding: 7,
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
    borderColor: "black",
  },
  docText: {
    textAlign: "center",
    fontSize: 14,
  },
  btn: {
    flexDirection: "row",
    display: 'flex',
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
