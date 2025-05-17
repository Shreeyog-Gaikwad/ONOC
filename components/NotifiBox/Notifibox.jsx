import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import { auth, db } from "@/config/FirebaseConfig";
import { collection, query, where, onSnapshot, or, Timestamp } from "firebase/firestore";
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { doc, updateDoc, getDocs } from "firebase/firestore";
import { TextInput } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Alert } from 'react-native';

const Notifibox = () => {
  const [recever, setRecever] = useState([]);
  const [sender, setSender] = useState([]);

  const [receverReq, setReceverReq] = useState([]);
  const [senderReq, setSenderReq] = useState([]);

  const [allRequests, setAllRequests] = useState([...recever, ...sender]);
  const [allReqRequests, setAllReqRequests] = useState([...receverReq, ...senderReq]);

  const [sortedRequests, setSortedRequests] = useState([...allRequests, ...allReqRequests]);
  const [rfid, setRfid] = useState([]);

  const [allLogs, setAllLogs] = useState([...sortedRequests, ...rfid]);

  //RFID Documents

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "rfidDocs"),
        where("email", "==", auth.currentUser?.email),
      ),
      (snapshot) => {
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          fromRfid: true,
          ...doc.data(),
        }));
        setRfid(userData);
      }
    );
    return () => unsubscribe();
  }, []);


  // For Send Documents Recever
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendRequests"),
        where("to", "==", auth.currentUser?.displayName),
      ),
      (snapshot) => {
        const receverData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecever(receverData);
      }
    );
    return () => unsubscribe();
  }, []);

  //For Send Documents Sender
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendRequests"),
        where("from", "==", auth.currentUser?.displayName),
      ),
      (snapshot) => {
        const senderData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSender(senderData);
      }
    );
    return () => unsubscribe();
  }, []);

  // For Request Documents Recever
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendDocRequests"),
        where("to", "==", auth.currentUser?.displayName),
      ),
      (snapshot) => {
        const receverData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReceverReq(receverData);
      }
    );
    return () => unsubscribe();
  }, []);

  // For Request Documents Sender
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sendDocRequests"),
        where("from", "==", auth.currentUser?.displayName),
      ),
      (snapshot) => {
        const senderData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSenderReq(senderData);
      }
    );
    return () => unsubscribe();
  }, []);


  // For Send Documents Request
  const handleRequestAction = async (requestId, action) => {
    if (action === 'Accept') {
      try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const requestRef = doc(db, "sendRequests", requestId);
        await updateDoc(requestRef, {
          status: 'accepted',
          acceptTime: new Date(),
          otp: otp,
          otpExpirationTime: new Date(Date.now() + 10 * 60 * 1000),
        });
      } catch (error) {
        console.error("Error accepting request: ", error);
      }

    } else if (action === 'Reject') {
      try {
        const requestRef = doc(db, "sendRequests", requestId);
        await updateDoc(requestRef, {
          status: 'rejected',
          rejectTime: new Date(),
        });
        console.log("Rejected request.");
      } catch (error) {
        console.error("Error rejecting request: ", error);
      }
    }
  };

  //For Request Documents Request
  const handleSendRequestAction = async (requestId, action, item) => {
    const userId = auth.currentUser?.uid;

    if (action === 'Accept') {
      try {
        const q = query(collection(db, "userinfo"), where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Error", "User data not found.");
          return;
        }

        const userData = querySnapshot.docs[0].data();
        const uploadedDocs = userData.uploadedDocuments || [];

        const requestedDocs = item.documents || [];
        const uploadedDocNames = uploadedDocs.map(doc => doc.name.toLowerCase());
        const missingDocs = requestedDocs.filter(reqDoc => !uploadedDocNames.includes(reqDoc.toLowerCase()));


        if (missingDocs.length > 0) {
          Alert.alert(
            "Missing Documents",
            `You need to upload the following document(s) first in order to accept the request:\n\n${missingDocs.join(", ")}`
          );
          return;
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const requestRef = doc(db, "sendDocRequests", requestId);
        await updateDoc(requestRef, {
          status: 'accepted',
          acceptTime: new Date(),
          otp: otp,
          otpExpirationTime: new Date(Date.now() + 10 * 60 * 1000),
        });

      } catch (error) {
        console.error("Error during accept flow:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }

    } else if (action === 'Reject') {
      try {
        const requestRef = doc(db, "sendDocRequests", requestId);
        await updateDoc(requestRef, {
          status: 'rejected',
          rejectTime: new Date()
        });
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    }
  };


  //For Send Documents Request
  const [enteredOtp, setEnteredOtp] = useState({});
  const [verified, setVerified] = useState({});

  const handleOtpVerify = async (id, correctOtp) => {
    if (enteredOtp[id] === correctOtp) {
      setVerified(prev => ({ ...prev, [id]: true }));

      try {
        const docRef = doc(db, "sendRequests", id);
        await updateDoc(docRef, {
          docSendTime: new Date(),
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

  //For Send Documents Request
  const [enterOtp, setEnterOtp] = useState({});
  const [verifiedOtp, setVerifiedOtp] = useState({});

  const handleReqOtpVerify = async (id, correctOtp) => {
    if (enterOtp[id] === correctOtp) {
      setVerifiedOtp(prev => ({ ...prev, [id]: true }));

      try {
        const docRef = doc(db, "sendDocRequests", id);
        await updateDoc(docRef, {
          docSendTime: new Date(),
          sendConfirmed: true
        });
        console.log("sendConfirmed set to true for request:", id);
      } catch (error) {
        console.error("Failed to update sendConfirmed:", error);
      }
    } else {
      setVerifiedOtp(prev => ({ ...prev, [id]: false }));
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

  const checkOtpExpiration = (item) => {
    if (item.otpExpirationTime) {
      const currentTime = new Date();
      const expirationTime = item.otpExpirationTime.toDate();
      if (currentTime < expirationTime) {
        return true;
      } else {
        return false;
      }
    }
  };


  //Merging Send Documents Requests
  useEffect(() => {
    const combined = [...recever, ...sender];
    const sorted = combined.sort((a, b) => {
      const timeA = a.sendTime?.toDate?.() || a.acceptTime?.toDate?.() || a.rejectTime?.toDate?.() || new Date(0);
      const timeB = b.sendTime?.toDate?.() || b.acceptTime?.toDate?.() || b.rejectTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
    setAllRequests(sorted);
  }, [recever, sender]);

  //Merging Request Document Requests
  useEffect(() => {
    const combined = [...receverReq, ...senderReq];
    const sorted = combined.sort((a, b) => {
      const timeA = a.sendTime?.toDate?.() || a.acceptTime?.toDate?.() || a.rejectTime?.toDate?.() || new Date(0);
      const timeB = b.sendTime?.toDate?.() || b.acceptTime?.toDate?.() || b.rejectTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
    setAllReqRequests(sorted);
  }, [receverReq, senderReq]);

  // Merging Send Doc And Request Doc
  useEffect(() => {
    const combined = [...allRequests, ...allReqRequests];
    const sorted = combined.sort((a, b) => {
      const timeA = a.sendTime?.toDate?.() || a.acceptTime?.toDate?.() || a.rejectTime?.toDate?.() || new Date(0);
      const timeB = b.sendTime?.toDate?.() || b.acceptTime?.toDate?.() || b.rejectTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
    setSortedRequests(sorted);
  }, [allRequests, allReqRequests]);

  //Merging RFID logs and Other All Logs
  useEffect(() => {
    const combined = [...sortedRequests, ...rfid];
    const sorted = combined.sort((a, b) => {
      const timeA = a.sendTime?.toDate?.() || a.acceptTime?.toDate?.() || a.rejectTime?.toDate?.() || new Date(0);
      const timeB = b.sendTime?.toDate?.() || b.acceptTime?.toDate?.() || b.rejectTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
    setAllLogs(sorted);
  }, [sortedRequests, rfid]);


  // For Send Documents Recever
  const receverSide = ({ item }) => (
    <View style={styles.Item}>
      <Text style={styles.requestText}><Feather name="user" size={14} /> {item.from}</Text>

      {item.status === 'accepted' ? (
        item.sendConfirmed ? (
          <View>
            <Text>
              {item.from} shared some documents.
            </Text>
            <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
            <Text>
              Date-Time: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.acceptTime)}</Text>
            </Text>
            <Text style={{ color: 'green' }}>
              <AntDesign name="checkcircle" size={13} color="green" /> OTP verified. You can see the Documents in History Tab.
            </Text>
          </View>
        ) : (
          <>
            {checkOtpExpiration(item) ? (
              <>
                <Text>Enter OTP shared by {item.from} to receive the documents :</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="Enter OTP"
                  value={enteredOtp[item.id] || ''}
                  onChangeText={(text) =>
                    setEnteredOtp((prev) => ({ ...prev, [item.id]: text }))
                  }
                />
                <Text>
                  OTP should be entered before <Text style={styles.bold}>{formatTimestamp(item.otpExpirationTime)}</Text> after that OTP will be expired
                </Text>
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleOtpVerify(item.id, item.otp)}
                >
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>

                {verified[item.id] === true && (
                  <Text style={{ color: 'green' }}>
                    OTP verified <AntDesign name="checkcircle" size={13} color="green" />.
                    You can see the documents in History Tab
                  </Text>
                )}

                {verified[item.id] === false && (
                  <Text style={{ color: 'red' }}>
                    Incorrect OTP <Entypo name="circle-with-cross" size={15} color="red" />
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text>{item.from} wanted to share documents.</Text>
                <Text>
                  Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                </Text>
                <Text>
                  Date-Time : <Text style={styles.bold}>{formatTimestamp(item.otpExpirationTime)}</Text>
                </Text>
                <Text style={{ color: 'red' }}>
                  Time expired to enter the OTP <Entypo name="circle-with-cross" size={15} color="red" />
                </Text>
              </>
            )}

          </>
        )
      ) : item.status === 'rejected' ? (
        <View>
          <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
          <Text>
            Rejected at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.rejectTime)}</Text>
          </Text>
          <Text style={{ color: 'red' }}>
            <Entypo name="circle-with-cross" size={15} color="red" /> You rejected the request from <Text style={styles.bold}>{item.from}</Text>.
          </Text>
        </View>
      ) : (
        <>
          <Text>{item.from} Wants to send you documents.</Text>
          <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
          <Text>Date-Time : <Text style={styles.bold}>{formatTimestamp(item.sendTime)}</Text></Text>
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

  // For Send Documents Sender
  const senderSide = ({ item }) => {
    return (
      item.fromRfid ?
        <View>
          <Text>
            You shared some documents by RFID Card.
          </Text>
          <Text style={styles.docs}>
            {item.documents.map((doc, index) => (
              <View style={styles.doc} key={index}>
                <Feather name="paperclip" size={13} color="black" /> {doc.name}
              </View>
            ))}
          </Text>
          <Text>
            Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
          </Text>
          <Text>
            Date-Time: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.sendTime)}</Text>
          </Text>
        </View> :
        <View style={styles.Item}>
          <Text style={styles.requestText}><Feather name="user" size={14} /> {item.to}</Text>
          {item.status === 'pending' ? (
            <>
              <Text>
                You wanted to share some documents to {item.to}.
              </Text>
              <Text style={styles.title}>
                Request successfully sent to <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
              </Text>
              <Text>
                Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
              </Text>
              <Text>
                Date-Time: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.sendTime)}</Text>
              </Text>
            </>
          ) : item.status === 'accepted' ? (
            item.sendConfirmed ? (
              <>
                <Text>
                  Documents successfully delivered.
                </Text>
                <Text style={styles.title}>
                  <AntDesign name="checkcircle" size={13} color="green" /> OTP verified by <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
                </Text>
                <Text>
                  Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                </Text>
                <Text>
                  Delivered at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.docSendTime)}</Text>
                </Text>
              </>
            ) : (
              <>
                {checkOtpExpiration(item) ?
                  <>
                    <Text style={styles.title}>
                      Request Accepted by <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
                    </Text>
                    <Text>
                      Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                    </Text>
                    <Text>
                      Your OTP is: <Text style={{ fontWeight: 'bold' }}>{item.otp}</Text>
                    </Text>
                    <Text>
                      Share this OTP manually with <Text style={{ fontWeight: 'bold' }}>{item.to}</Text> to continue.
                    </Text>
                    <Text>
                      Accepted at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.acceptTime)}</Text>
                    </Text>
                  </>
                  :
                  <>
                    <Text>You wanted to share documents to {item.to}</Text>
                    <Text>
                      Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                    </Text>
                    <Text>OTP not entered by {item.to} before the expiration time</Text>
                    <Text style={{ color: 'red' }}>
                      Documents not send <Entypo name="circle-with-cross" size={15} color="red" />
                    </Text>
                  </>
                }
              </>
            )
          ) : item.status === 'rejected' ? (
            <>
              <Text>
                You wanted to share some documents to {item.to}
              </Text>
              <Text style={styles.title}>
                Request Rejected by <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
              </Text>
              <Text>
                Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
              </Text>
              <Text>
                Rejected at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.rejectTime)}</Text>
              </Text>
              <Text style={{ color: 'red' }}>
                Documents not send <Entypo name="circle-with-cross" size={15} color="red" />
              </Text>
            </>
          ) : null}
        </View >
    );
  };

  // For Request Documents Recever
  const receverReqSide = ({ item }) => {
    return (<View style={styles.Item}>
      <Text style={styles.requestText}><Feather name="user" size={14} /> {item.from}</Text>

      {item.status === 'accepted' ? (
        item.sendConfirmed ? (
          <>
            <Text>
              Documents successfully delivered for the request send by {item.from}.
            </Text>
            <Text style={styles.title}>
              <AntDesign name="checkcircle" size={13} color="green" /> OTP verified by <Text style={{ fontWeight: 'bold' }}>{item.from}</Text>
            </Text>
            <Text>
              Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
            </Text>
            <Text>
              Delivered at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.docSendTime)}</Text>
            </Text>
          </>
        ) : (
          <>
            {checkOtpExpiration(item) ?
              <>
                <Text style={styles.title}>
                  You accepted the request send by <Text style={{ fontWeight: 'bold' }}>{item.from}</Text>
                </Text>
                <Text>
                  Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                </Text>
                <Text>
                  Your OTP is: <Text style={{ fontWeight: 'bold' }}>{item.otp}</Text>
                </Text>
                <Text>
                  Share this OTP manually with <Text style={{ fontWeight: 'bold' }}>{item.from}</Text> to continue.
                </Text>
              </>
              :
              <>
                <Text style={styles.title}>
                  You accepted the request send by <Text style={{ fontWeight: 'bold' }}>{item.from}</Text>
                </Text>
                <Text>
                  Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                </Text>
                <Text>OTP not entered by {item.from} before the expiration time</Text>
                <Text style={{ color: 'red' }}>
                  Documents not send <Entypo name="circle-with-cross" size={15} color="red" />
                </Text>
              </>
            }

          </>
        )
      ) : item.status === 'rejected' ? (
        <View>
          <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
          <Text>
            Rejected at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.rejectTime)}</Text>
          </Text>
          <Text style={{ color: 'red' }}>
            <Entypo name="circle-with-cross" size={15} color="red" /> You rejected the request send by <Text style={styles.bold}>{item.from}</Text>.
          </Text>
        </View>
      ) : (
        <>
          <Text>{item.from} requested you to send Documents.</Text>
          <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
          <Text>Date-Time : <Text style={styles.bold}>{formatTimestamp(item.sendTime)}</Text></Text>
          <View style={styles.docs}>
            {item.documents.map((doc, index) => (
              <Text key={('doc') + '-' + index} style={styles.doc}>
                <Feather name="paperclip" size={13} color="black" /> {doc}
              </Text>
            ))}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => handleSendRequestAction(item.id, 'Reject', item)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => handleSendRequestAction(item.id, 'Accept', item)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>)
  }


  // For Request Documents Sender
  const senderReqSide = ({ item }) => {
    return (<View style={styles.Item}>
      <Text style={styles.requestText}><Feather name="user" size={14} /> {item.to}</Text>
      {item.status === 'pending' ? (
        <>
          <Text>
            You sended request to receive documents from {item.to}.
          </Text>
          <Text style={styles.title}>
            Request successfully sent to <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
          </Text>
          <Text>
            Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
          </Text>
          <Text>
            Date-Time: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.sendTime)}</Text>
          </Text>
        </>
      ) : item.status === 'accepted' ? (
        item.sendConfirmed ? (
          <View>
            <Text>
              You successfully received the documents from {item.to}
            </Text>
            <Text>Request ID : <Text style={styles.bold}>{item.requestId}</Text></Text>
            <Text>
              Date-Time: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.acceptTime)}</Text>
            </Text>
            <Text style={{ color: 'green' }}>
              <AntDesign name="checkcircle" size={13} color="green" /> OTP verified. You can see the Documents in History Tab.
            </Text>
          </View>
        ) : (
          <>
            {checkOtpExpiration(item) ? (
              <>
                <Text>Enter OTP shared by {item.to} to receive the documents :</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="Enter OTP"
                  value={enterOtp[item.id] || ''}
                  onChangeText={(text) =>
                    setEnterOtp((prev) => ({ ...prev, [item.id]: text }))
                  }
                />
                <Text>
                  OTP should be entered before <Text style={styles.bold}>{formatTimestamp(item.otpExpirationTime)}</Text> after that OTP will be expired
                </Text>
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleReqOtpVerify(item.id, item.otp)}
                >
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>

                {verifiedOtp[item.id] === true && (
                  <Text style={{ color: 'green' }}>
                    OTP verified <AntDesign name="checkcircle" size={13} color="green" />.
                    You can see the documents in History Tab
                  </Text>
                )}

                {verifiedOtp[item.id] === false && (
                  <Text style={{ color: 'red' }}>
                    Incorrect OTP <Entypo name="circle-with-cross" size={15} color="red" />
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text>{item.to} accepted the request that you send to receive documents.</Text>
                <Text>
                  Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
                </Text>
                <Text>
                  Date-Time : <Text style={styles.bold}>{formatTimestamp(item.otpExpirationTime)}</Text>
                </Text>
                <Text style={{ color: 'red' }}>
                  Time expired to enter the OTP <Entypo name="circle-with-cross" size={15} color="red" />
                </Text>
              </>
            )}
          </>
        )
      ) : item.status === 'rejected' ? (
        <>
          <Text>
            You requested some documents from {item.to}
          </Text>
          <Text style={styles.title}>
            Request Rejected by <Text style={{ fontWeight: 'bold' }}>{item.to}</Text>
          </Text>
          <Text>
            Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text>
          </Text>
          <Text>
            Rejected at: <Text style={{ fontWeight: 'bold' }}>{formatTimestamp(item.rejectTime)}</Text>
          </Text>
          <Text style={{ color: 'red' }}>
            Documents not received <Entypo name="circle-with-cross" size={15} color="red" />
          </Text>
        </>
      ) : null}
    </View >)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRequests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => {
          return item.from === auth.currentUser?.displayName
            ? (allReqRequests.some(req => req.requestId === item.requestId)
              ? senderReqSide({ item })
              : senderSide({ item }))
            : (allReqRequests.some(req => req.requestId === item.requestId)
              ? receverReqSide({ item })
              : receverSide({ item }));
        }}
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
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold'
  }

});
