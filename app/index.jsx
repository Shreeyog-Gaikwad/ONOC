import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GetStarted from './GetStarted'
import { auth } from '../config/FirebaseConfig'
import { useRouter } from 'expo-router'



const index = () => {
  const router = useRouter();
  const[user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        router.replace("/home"); 
      }
    });

    return () => unsubscribe();
  }, []);

  return <View>{!user && <GetStarted />}</View>; 

}

export default index

const styles = StyleSheet.create({

})