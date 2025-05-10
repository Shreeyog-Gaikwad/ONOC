import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from "react";
import { auth, db } from "@/config/FirebaseConfig";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import uuid from 'react-native-uuid';

const selectdoc = () => {
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
            name: doc.name,
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

  const send = async () => {
    const shortId = uuid.v4().split('-')[0]; 
    const requestId = `REQ_${shortId}`;

    try {
      await setDoc(doc(db, "sendRequests", `${item.email}_${Date.now()}`), {
        requestId,
        from: auth.currentUser.displayName,
        to: item.name,
        documents: selectedDocs,
        status: "pending",
        sendTime: new Date()
      });
      console.log("Request created successfully");

      Alert.alert(
        "Documents Sent",
        `Documents have been sent to ${item.name || 'user'} successfully.`,
        [{ text: "OK" ,
          onPress: () => router.back() 
        }]
        
      );
      setSelectedDocs([]);
  
    } catch (err) {
      console.error("Error sending document request:", err);
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
              <Text style={styles.docText}>{docInfo.name}</Text>
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

        <TouchableOpacity style={styles.btn} onPress={send}>
          <Text style={styles.btntxt}>Send Documents</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default selectdoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginTop: 50,
    height: '100%',
  },
  head1: {
    fontSize: 35,
    fontWeight: "bold",
  },
  head2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  name: {
    color: "green",
  },
  boxContainer: {
    marginTop: 20,
    height: '85%',
    display: 'flex',
    alignItems: "center",
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
