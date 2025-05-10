import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import { auth, db } from "@/config/FirebaseConfig";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { doc, updateDoc } from "firebase/firestore";
import { TextInput } from 'react-native';

const Notifibox = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendRequests"),
        where("to", "==", auth.currentUser?.displayName),
      ),
      (snapshot) => {
        const requestsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);
      }
    );

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendRequests"),
        where("from", "==", auth.currentUser?.displayName),
        where("status", "==", "accepted")
      ),
      (snapshot) => {
        const acceptedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAcceptedRequests(acceptedData);
      }
    );

    return () => unsubscribe();
  }, []);


  const handleRequestAction = async (requestId, action) => {
    if (action === 'Accept') {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      try {
        const requestRef = doc(db, "sendRequests", requestId);
        await updateDoc(requestRef, {
          status: 'accepted',
          otp: otp,
          acceptTime: new Date()
        });
        console.log(`Accepted request. OTP: ${otp}`);
      } catch (error) {
        console.error("Error accepting request: ", error);
      }

    } else if (action === 'Reject') {
      try {
        const requestRef = doc(db, "sendRequests", requestId);
        await updateDoc(requestRef, {
          status: 'rejected',
          rejectTime: new Date()
        });
        console.log("Rejected request.");
      } catch (error) {
        console.error("Error rejecting request: ", error);
      }
    }
  };

  const [enteredOtp, setEnteredOtp] = useState({});
  const [verified, setVerified] = useState({});

  const handleOtpVerify = async (id, correctOtp) => {
    if (enteredOtp[id] === correctOtp) {
      setVerified(prev => ({ ...prev, [id]: true }));

      try {
        const docRef = doc(db, "sendRequests", id);
        await updateDoc(docRef, {
          sendConfirmed: true
        });
        console.log("sendConfirmed set to true for request:", id);
      } catch (error) {
        console.error("Failed to update sendConfirmed:", error);
      }
    } else {
      setVerified(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${day}/${month}/${year} ${time}`;
  };

   const renderAcceptedItem = ({ item }) => (
    <View style={styles.Item}>
      <Text style={styles.title}>Request Accepted by <Text style={{ fontWeight: 'bold' }}>{item.to}</Text></Text>
      <Text>Your OTP is: <Text style={{ fontWeight: 'bold' }}>{item.otp}</Text></Text>
      <Text>Share this OTP manually with <Text style={{ fontWeight: 'bold' }}>{item.to}</Text> to continue.</Text>
      <Text>Responded at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.acceptTime)}</Text></Text>
    </View>
  );
  

  const renderRequestItem = ({ item }) => (
    <View style={styles.Item}>
      <Text style={styles.requestText}><Feather name="user" size={14} /> {item.from}</Text>
      {item.status === 'accepted' ? (
        item.sendConfirmed ? (
          <Text style={{ color: 'green' }}>
            ✅ OTP already verified. Documents are available in the History Tab.

          </Text>
        ) : (
          <>
            <Text>Enter OTP shared by {item.from} to receive the documents :</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Enter OTP"
              value={enteredOtp[item.id] || ''}
              onChangeText={(text) => setEnteredOtp(prev => ({ ...prev, [item.id]: text }))}
            />
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => handleOtpVerify(item.id, item.otp)}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
            {verified[item.id] === true && (
              <Text style={{ color: 'green' }}>
                OTP verified ✅. You can see the documents in History Tab
              </Text>
            )}
            {verified[item.id] === false && (
              <Text style={{ color: 'red' }}>
                Incorrect OTP ❌
              </Text>
            )}
          </>
        )
      ) : (
        <>
          <Text>Wants to send you documents.</Text>
          <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
          <Text>Date-Time : <Text  style={styles.bold}>{formatTimestamp(item.sendTime)}</Text></Text>
          <View style={styles.docs}>
            {item.documents.map((doc, index) => (
              <Text key={doc.name + index} style={styles.doc}>
                <Feather name="paperclip" size={13} color="black" /> {doc.name}
                <Text>{doc.timestamp}</Text>
              </Text>
            ))}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => handleRequestAction(item.id, 'Reject')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => handleRequestAction(item.id, 'Accept')}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled={true}
        data={[...requests].reverse()}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
      />
      <FlatList
        data={[...acceptedRequests].reverse()}
        renderItem={renderAcceptedItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Notifibox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    padding: 20,
    borderRadius: 20,
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Item: {
    backgroundColor: '#c6d4f5',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: ' #000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  requestText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button1: {
    backgroundColor: 'rgb(240, 56, 56)',
    width: '45%',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  docs: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 5
  },
  doc: {
    backgroundColor: '#fff',
    padding: 5,
    paddingHorizontal: 9,
    borderRadius: 15
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgb(1, 79, 142)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    backgroundColor: 'white'
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: '50%',
  },
  bold : {
    fontWeight: 'bold'
  }

});
