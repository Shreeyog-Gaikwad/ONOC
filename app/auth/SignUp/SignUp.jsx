import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, ScrollView, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, useNavigation } from "expo-router";
import { auth, db } from '../../../config/FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, addDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";


const Login = () => {

    const router = useRouter();

    const navigation = useNavigation();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [username, setUsername] = useState("");

    const SignUp = async () => {

        if (!name || !username || !email || !pass || !number) {
            ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
            return;
        }

        const checkField = async (field, value) => {
            const q = query(collection(db, "userinfo"), where(field, "==", value));
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        };

        if (await checkField("username", username)) {
            ToastAndroid.show("Username already taken.", ToastAndroid.SHORT);
            return;
        }

        if (await checkField("email", email)) {
            ToastAndroid.show("Email already in use.", ToastAndroid.SHORT);
            return;
        }

        if (await checkField("number", number)) {
            ToastAndroid.show("Phone number already registered.", ToastAndroid.SHORT);
            return;
        }

        if (pass.length < 6) {
            ToastAndroid.show("Password length must be atleast 6 characters.", ToastAndroid.SHORT);
            return;
        }

        if (number.length !== 10) {
            ToastAndroid.show("Phone number must be exactly 10 digits.", ToastAndroid.SHORT);
            return;
        }

        const onlyDigits = /^[0-9]+$/;
        if (!onlyDigits.test(number)) {
            ToastAndroid.show("Phone number must contain digits only.", ToastAndroid.SHORT);
            return;
        }

        createUserWithEmailAndPassword(auth, email, pass)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: name,
                })

                const docRef = await addDoc(collection(db, "userinfo"), {
                    id: user.uid,
                    name: name,
                    number: "+91" + number,
                    email: email,
                    username: username,
                });
                console.log("Document written with ID: ", docRef.id);

                router.replace("/(tabs)/home")
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Sign up error:", errorMessage);
            });
    }

    return (

        <KeyboardAvoidingView onPress={Keyboard.dismiss} style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                                <TextInput style={styles.input} placeholder="Enter your Full Name" onChangeText={(value) => {
                                    setName(value);
                                    if (value === "") {
                                        setUsername("");
                                    } else {
                                        const base = value.toLowerCase().replace(/\s+/g, '');
                                        const random = Math.floor(100 + Math.random() * 900); // 3-digit number
                                        setUsername(`${base}${random}`);
                                    }
                                }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Username</Text>
                                <TextInput style={styles.input} placeholder="Enter Username to be set" value={username}
                                    onChangeText={(value) => setUsername(value)} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Phone Number</Text>
                                <View style={[styles.addcontainer, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgb(211, 211, 211)' }]}>
                                    <Text style={{ fontSize: 16, color: 'black', marginRight: 8, marginLeft: 8 }}>+91</Text>
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        placeholder="Enter your Phone Number"
                                        maxLength={10}
                                        onChangeText={(value) => { setNumber(value) }}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Email</Text>
                                <TextInput style={styles.input} placeholder="Enter your Email" onChangeText={(value) => setEmail(value)} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputContainerTxt}>Password</Text>
                                <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry={true} onChangeText={(value) => setPass(value)} />
                            </View>
                            <TouchableOpacity style={styles.login} onPress={SignUp} >
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
        position: "relative",
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
        marginTop: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 90,
        width: 150,
        borderRadius: 10,
    },
    inputContainerWrapper: {
        marginTop: 15,
        width: '90%',
    },
    inputContainer: {
        marginVertical: 5,
    },
    inputContainerTxt: {
        fontSize: 15,
        color: '#3629B7',
        marginLeft: 3
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
    },
    addcontainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey'
    }
})