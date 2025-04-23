import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, ScrollView, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, useNavigation } from "expo-router";
import { auth, db } from '../../../config/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Login = () => {

    const router = useRouter();

    const navigation = useNavigation();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const login = async() => {

        if (!email || !pass) {
            ToastAndroid.show("Please enter your email/username and password.", ToastAndroid.SHORT);
            return;
        }

        let emailToLogin = email;

        if (!email.includes('@')) {
            const q = query(collection(db, "userinfo"), where("username", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                emailToLogin = userData.email;
            } else {
                ToastAndroid.show("Invalid Credentials!!", ToastAndroid.SHORT);
                return;
            }
        }

        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);

                router.replace("/(tabs)/home")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const forgetPass = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Email sent");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
            setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
            setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);




    return (
        <KeyboardAvoidingView onPress={Keyboard.dismiss} style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor="#3629B7" />
                    <View style={styles.container1}>
                        <Text style={styles.text}>
                            <TouchableOpacity style={styles.arrow} onPress={() => router.replace('/')}>
                                <AntDesign name="left" size={25} color="white" />
                            </TouchableOpacity>
                            Login</Text>
                    </View>
                    <View style={styles.container2}>
                        <Text style={styles.head1}>Welcome Back,</Text>
                        <Text style={styles.head2}>Hello there, Login to continue</Text>

                        <View style={styles.ImageView}>
                            <Image source={require('../../../assets/images/ONOC.png')} style={styles.image} />
                        </View>


                        <View style={styles.inputContainerWrapper}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Email</Text>
                                <TextInput style={styles.input} placeholder="Enter your Email" onChangeText={(value) => setEmail(value)} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Password</Text>
                                <TextInput style={styles.input} placeholder="Enter your Password" secureTextEntry={true} onChangeText={(value) => setPass(value)} />
                            </View>
                            <TouchableOpacity style={styles.login} onPress={login}>
                                <Text style={styles.logintxt}>Login </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.forgot} onPress={forgetPass}>
                                <Text style={styles.forgot}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <View style={styles.signupCont}>
                                <Text>Don't have an Account?</Text>
                                <TouchableOpacity onPress={() => { router.replace('/auth/SignUp/SignUp') }}>
                                    <Text style={styles.signuptxt}>Create Account</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

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
        marginTop: 20,
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
        marginVertical: 10,
    },
    inputContainerTxt: {
        fontSize: 20,
        color: '#3629B7',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        padding: 10,
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