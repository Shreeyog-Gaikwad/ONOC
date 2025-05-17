import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

const selectMethod = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.head1}>
                <Text style={styles.head1}>Select method to send Documents</Text>
            </View>

            <View style={styles.btns}>
                <TouchableOpacity style={styles.btn} onPress={() => router.push("/Pages/send")}>
                    <Entypo name="mobile" size={55} color="black" />
                    <Text style={styles.txt}>Send Documents by ONOC App</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                    <Image source={require('../../assets/images/ONOC.png')} style={styles.image} />
                    <Text  style={styles.txt}>Send Documents by ONOC Card</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default selectMethod

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        marginTop: 50,
        height: '100%',
    },
    head1: {
        fontSize: 33,
        fontWeight: "bold",
    },
    btns: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        gap: 50,
    },
    btn: {
        width: 200,
        height: 200,
        borderRadius: 15,
        backgroundColor: '#c6d4f5',
        borderWidth: 1,   
        borderColor: 'grey',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt : {
        fontSize: 20,
        textAlign: 'center',
        padding : 10,
        fontWeight: 'bold'
    },
    image : {
        width: 100,
        height: 65,
        borderRadius: 15
    }

})