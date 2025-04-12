import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";

const GetStarted = () => {

    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3629B7" />
            <View style={styles.container1}>
                <Image source={require('../assets/images/ONOC.png')} style={styles.image} />
            </View>
            <View style={styles.container2}>
                <Text style={styles.head}>Welcome to </Text>
                <Text style={styles.head}>One Nation One Card</Text>
                <Text style={styles.desc}>"ONOC" a smartcard that unifies all your government and personal IDs into one digital identity which can be shared whenever and wherever securly.</Text>
                <Text style={styles.line}>One Card. One Identity. One Nation</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/Login/Login')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                    <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default GetStarted

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3629B7'
    },
    container1: {
        height: '45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image:{
        height: 200,
        width: 300,
        borderRadius: 20,
    },
    container2: {
        height: '60%',
        backgroundColor: 'white',
        borderTopLeftRadius: '10%',
        borderTopRightRadius: '10%',
        paddingTop: '15%',
        diaplay: 'flex',
        alignItems: 'center',
    },
    head: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    desc:{
        margin: 20,
        textAlign: 'center'
    },
    line:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        width: '50%',
        backgroundColor: '#3629B7',
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10',
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    }
})