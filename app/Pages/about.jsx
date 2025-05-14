import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth, db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const about = () => {
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
                <Text style={styles.head}>About Us <AntDesign name="infocirlce" size={26} color="black" /></Text>
                <ScrollView>
                    <View style={styles.textContain}>
                        <View>
                            <Image source={require('../../assets/images/ONOC.png')} style={styles.image} />
                        </View>
                        <Text style={styles.text}>
                            <Text style={styles.bold}>W</Text>e created One Nation One Card (ONOC) with one clear goal: to eliminate the hassle of managing physical documents. Too often, important paperwork gets lost, scanned repeatedly, or delayed in processing. With ONOC, all your verified documents are securely stored in the cloud and accessible anytime with just a tap of your RFID card or a few clicks on your phone.
                        </Text>
                        <Text style={styles.text}>
                            Our platform is integrated with government systems, enabling smooth and verified document transfers during official processes—whether at a government office, university, or public service center.
                        </Text>
                        <Text style={styles.text}>
                            Security is at the heart of everything we do. With Firebase as our backend, every document is encrypted and stored with strict access controls, ensuring that only you and authorized parties can view or share them.
                        </Text>
                        <Text style={styles.text}>
                            ONOC is fast, eco-friendly, and built for a digital-first generation. Whether you're a student, professional, or citizen handling official work, our app helps you stay organized, save time, and go paperless—safely.
                        </Text>
                    </View>
                </ScrollView>

            </View>
        </View>
    )
}

export default about

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
    textContain: {
        paddingHorizontal: 25,
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 18,
        textAlign: 'justify',
        paddingBottom: 20,
        width: '100%'
    },
    image: {
        height: 160,
        width: 250,
        borderRadius: 20,
        marginBottom: 20,
    },
})