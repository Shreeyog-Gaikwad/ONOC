import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import uuid from 'react-native-uuid';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, addDoc } from "firebase/firestore";
import { auth, db } from "@/config/FirebaseConfig";
import { Alert } from 'react-native';



const selectRfidDocs = () => {
    const item = useLocalSearchParams();
    const router = useRouter();

    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const user = auth.currentUser;
            try {
                const firestore = getFirestore();
                const userinfoRef = collection(firestore, "userinfo");
                const q = query(userinfoRef, where("email", "==", user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const uploadedDocs = userDoc.data().uploadedDocuments || [];

                    const filteredDocs = uploadedDocs.map(doc => ({
                        docName: doc.name,
                        downloadUrl: doc.path,
                        firebasePath: doc.firebasePath || null,
                    }));

                    setUploadedDocs(filteredDocs);
                }
            } catch (err) {
                console.error("Error fetching documents:", err);
            }
        };

        fetchDocs();
    }, []);

    const handleSelection = (docInfo) => {
        const alreadySelected = selectedDocs.some((doc) => doc.downloadUrl === docInfo.downloadUrl);

        setSelectedDocs(prev =>
            alreadySelected
                ? prev.filter((doc) => doc.downloadUrl !== docInfo.downloadUrl)
                : [...prev, docInfo]
        );
    };

    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchDocs = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const firestore = getFirestore();
                const userinfoRef = collection(firestore, "userinfo");
                const q = query(userinfoRef, where("email", "==", user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();

                    const filteredData = {
                        name: userDoc.name,
                        email: userDoc.email,
                        number: userDoc.number,
                        profilePic: userDoc.profilePic,
                        rfid: userDoc.rfid,
                        username: userDoc.username,
                    };

                    setUserData(filteredData);
                }
            } catch (err) {
                console.error("Error fetching documents:", err);
            }
        };

        fetchDocs();
    })

    const handleSendDocuments = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "User not authenticated.");
            return;
        }

        if (selectedDocs.length === 0) {
            Alert.alert("No Documents Selected", "Please select at least one document.");
            return;
        }

        try {
            const firestore = getFirestore();

            const shortId = uuid.v4().split('-')[0];
            const sanitizedEmail = user.email.replace(/[.#$[\]]/g, "_");
            const docId = `${sanitizedEmail}_${shortId}`;
            const requestId = `REQ_${shortId}`;

            const newDoc = {
                requestId,
                sendTime: new Date(),
                name: userData.name,
                email: userData.email,
                number: userData.number,
                profilePic: userData.profilePic,
                rfid: userData.rfid,
                username: userData.username,
                status: "pending",
                documents: selectedDocs,
                fromRfid : true,
            };

            await setDoc(doc(firestore, "rfidDocs", docId), newDoc);

            Alert.alert("Success", "Documents sent successfully to RFID Card!");
            setSelectedDocs([]);

            router.push('/(tabs)/home');

        } catch (error) {
            console.error("Error sending documents:", error);
            Alert.alert("Error", "Failed to send documents.");
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.head1}>Select Documents</Text>
                    <Text style={styles.head2}>
                        to send <Text style={styles.name}>{item.name} !</Text>
                    </Text>
                </View>

                <ScrollView contentContainerStyle={styles.boxContainer}>
                    {uploadedDocs.map((docInfo, index) => (
                        <TouchableOpacity key={index} style={styles.box} onPress={() => handleSelection(docInfo)}>
                            <Text style={styles.docText}>{docInfo.docName}</Text>
                            <View
                                style={[
                                    styles.checkbox,
                                    selectedDocs.some((doc) => doc.downloadUrl === docInfo.downloadUrl) && styles.selectedCheckbox,
                                ]}
                            >
                                <Text style={styles.checkboxText}>
                                    {selectedDocs.some((doc) => doc.downloadUrl === docInfo.downloadUrl) ? <AntDesign name="checkcircle" size={24} color="green" /> : <Entypo name="circle" size={24} color="red" />}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.btn} onPress={handleSendDocuments}>
                    <Text style={styles.btntxt}>Send Documents by RFID Card</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

export default selectRfidDocs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    head1: {
        fontSize: 35,
        fontWeight: "bold",
    },
    head2: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    name: {
        color: "green",
    },
    boxContainer: {
        paddingBottom: 30,
        width: '95%'
    },
    box: {
        backgroundColor: "rgb(216, 216, 216)",
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    docText: {
        fontSize: 18,
        color: "#333",
    },
    checkbox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 18,
        color: 'black',
    },
    btn: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderRadius: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: '#c6d4f5',
    },
    btntxt: {
        fontWeight: 'bold',
    }
});
