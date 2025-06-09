import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '@/config/FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';


const HistoryBox = () => {
  const [confirmedDocs, setConfirmedDocs] = useState([]);
  const [receivedDocs, setReceivedDocs] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe1 = onSnapshot(
      query( 
        collection(db, 'sendRequests'),
        where('to', '==', auth.currentUser?.displayName),
        where('sendConfirmed', '==', true)
      ),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'sent',
          ...doc.data(),
        }));
        setConfirmedDocs(data);
      }
    );

    const unsubscribe2 = onSnapshot(
      query(
        collection(db, 'sendDocRequests'),
        where('from', '==', auth.currentUser?.displayName),
        where('sendConfirmed', '==', true)
      ),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'received',
          ...doc.data(),
        }));
        setReceivedDocs(data);
      }
    );

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    const merged = [...confirmedDocs, ...receivedDocs];
    merged.sort((a, b) => {
      const timeA = a.docSendTime?.toDate?.() || new Date(0);
      const timeB = b.docSendTime?.toDate?.() || new Date(0);
      return timeB - timeA; 
    });
    setAllDocs(merged);
  }, [confirmedDocs, receivedDocs]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.senderText}>
        <Feather name="user" size={14} /> {item.type === 'sent' ? item.from : item.to}
      </Text>
      <Text>You received documents from {item.type === 'sent' ? item.from : item.to}</Text>
      <Text>Request ID : <Text style={{ fontWeight: 'bold' }}>{item.requestId}</Text></Text>
      <Text>Documents:</Text>
      {item.documents?.map((doc, index) => (
        <View style={styles.docs} key={index}>
          <Text style={styles.docText}>
            <Feather name="paperclip" size={13} /> {typeof doc === 'string' ? doc : doc.name}
          </Text>
         <TouchableOpacity
              style={styles.view}
              onPress={() =>{
                 console.log('Document being viewed:', doc);
                
                router.push({
                  pathname: '/Pages/preview',
                  params: {
                    url: typeof doc === 'string' ? doc :  doc.downloadUrl, 
                    name: typeof doc === 'string' ? doc : doc.name,
                  },
                })
              } }>
              <Text style={styles.viewTxt}>View</Text>
            </TouchableOpacity>

        </View>
      ))}
    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={allDocs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

    </View>
  );
};

export default HistoryBox;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 20,
    marginLeft: 20,

  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#c6d4f5',
    padding: 10,
    borderRadius: 10,
    shadowColor: ' #000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  senderText: {
    fontWeight: '600',
    marginBottom: 5,
  },
  docText: {
    marginLeft: 10,
  },
  docs: {
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7
  },
  view: {
    backgroundColor: '#007bff',
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  viewTxt: {
    color: '#fff',
  }
});
