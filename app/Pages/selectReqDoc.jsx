import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const selectdoc = () => {
    const item = useLocalSearchParams();
    const router = useRouter();
    const [selectedDocs, setSelectedDocs] = useState([]);

    const toggleDocSelection = (docName) => {
        if (selectedDocs.includes(docName)) {
            setSelectedDocs(selectedDocs.filter(name => name !== docName));
        } else {
            setSelectedDocs([...selectedDocs, docName]);
        }
    };

    const documents = [
        { name: "Aadhar Card" },
        { name: "PAN Card" },
        { name: "Driving License" },
        { name: "Voter ID" },
        { name: "Passport" },
        { name: "Ration Card" },
        { name: "Birth Certificate" },
        { name: "SSC Marksheet" },
        { name: "HSC Marksheet" },
        { name: "Domicile Certificate" },
        { name: "Caste Certificate" },
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.head1}>Select Documents</Text>
                    <Text style={styles.head2}>
                        to send <Text style={styles.name}>{item.name} !</Text>
                    </Text>
                </View>

                <ScrollView contentContainerStyle={styles.boxContainer} showsVerticalScrollIndicator={false}>

                    {documents.map((doc, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.box}
                            onPress={() => toggleDocSelection(doc.name)}
                        >
                            <Text style={styles.docText}>{doc.name}</Text>
                            <View style={styles.checkbox}>
                                {selectedDocs.includes(doc.name) ? (
                                    <AntDesign name="checkcircle" size={24} color="green" />
                                ) : (
                                    <Entypo name="circle" size={24} color="red" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}

                </ScrollView>

                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btntxt}>Request Documents</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

export default selectdoc;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    head1: {
        fontSize: 35,
        fontWeight: "bold",
    },
    head2: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    name: {
        color: "green",
    },
    boxContainer: {
        paddingBottom: 30, 
        width: '95%'
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
        marginBottom: 20,
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
