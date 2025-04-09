import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";

const Login = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3629B7" />
            <View style={styles.container1}>
                <Text style={styles.text}>
                    <TouchableOpacity style={styles.arrow} onPress={() => router.back()}>
                        <AntDesign name="left" size={25} color="white" />
                    </TouchableOpacity>
                    Sign Up</Text>
            </View>
            <View style={styles.container2}>
                <Text style={styles.head1}>Welcome to us,</Text>
                <Text style={styles.head2}>Hello there, create New Account</Text>

                <View style={styles.ImageView}>
                    <Image source={require('../../../assets/images/ONOC.png')} style={styles.image} />
                </View>


                <View style={styles.inputContainerWrapper}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputContainerTxt}>Name</Text>
                        <TextInput style={styles.input} placeholder="Enter your Full Name" onChangeText={(value) => setName(value)} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputContainerTxt}>Phone Number</Text>
                        <TextInput style={styles.input} placeholder="Enter your Phone Number" onChangeText={(value) => setNumber(value)} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputContainerTxt}>Email</Text>
                        <TextInput style={styles.input} placeholder="Enter your Email" onChangeText={(value) => setEmail(value)} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputContainerTxt}>Password</Text>
                        <TextInput style={styles.input} placeholder="Enter your Password" secureTextEntry={true} onChangeText={(value) => setPass(value)} />
                    </View>
                    <TouchableOpacity style={styles.login}>
                        <Text style={styles.logintxt}>Create Account </Text>
                    </TouchableOpacity>

                    <View style={styles.signupCont}>
                        <Text>Already have an Account?</Text>
                        <TouchableOpacity onPress={() => { router.replace('/auth/Login/Login') }}>
                            <Text style={styles.signuptxt}>Login</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>
        </View>

    )
}

export default Login

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#3629B7',
    },
    container1: {
        height: '15%',
    },
    text: {
        fontSize: 30,
        color: '#fff',
        paddingTop: 60,
        paddingLeft: 20,
        fontWeight: 'bold',
    },
    arrow: {
        paddingRight: 12,
    },
    container2: {
        height: '85%',
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingLeft: 20,
    },
    head1: {
        fontSize: 25,
        color: '#3629B7',
        marginTop: 30,
        fontWeight: 'bold',
    },
    head2: {
        fontSize: 20,
    },
    ImageView: {
        marginRight: 20,
        marginTop: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 110,
        width: 170,
        borderRadius: 10,
    },
    inputContainerWrapper: {
        marginTop: 30,
        width: '90%',
    },
    inputContainer: {
        marginVertical: 6,
    },
    inputContainerTxt: {
        fontSize: 18,
        color: '#3629B7',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        padding: 8,
        backgroundColor: "white",
    },
    login: {
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c6d4f5',
        padding: 8,
        borderRadius: 15,
    },
    logintxt: {
        fontSize: 20,
    },
    forgot: {
        textAlign: 'right',
        paddingRight: 10,
        paddingTop: 5,
        color: '#3629B7',
    },
    create: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 15,
        marginTop: 10,
        borderWidth: 1,
    },
    signupCont: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 30,
    },
    signuptxt: {
        color: '#3629B7',
    }
})