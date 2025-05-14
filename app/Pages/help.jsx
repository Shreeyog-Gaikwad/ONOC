import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';import { auth, db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const help = () => {

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
        <View style={styles.container}>

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
                <Text style={styles.head}>Help <Entypo name="help-with-circle" size={24} color="black" /></Text>

            </View>
        </View>
    )
}

export default help

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3629B7",
    },
    container1: {
        height: "15%",
        display: "flex",
        flexDirection: "row",
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
        width: '100%',
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
})