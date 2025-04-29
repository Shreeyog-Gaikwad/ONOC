import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const selectdoc = () => {
  const { ...item } = useLocalSearchParams();

  const [selectedDocs, setSelectedDocs] = useState([]);

  const documents = [
    { name: "Aadhar Card", lib: Ionicons, iconName: "finger-print", size: 36 },
    { name: "PAN Card", lib: FontAwesome, iconName: "id-card", size: 32 },
    { name: "Driving License", lib: MaterialIcons, iconName: "drive-eta", size: 38 },
    { name: "Voter ID", lib: MaterialCommunityIcons, iconName: "vote-outline", size: 32 },
    { name: "Passport", lib: FontAwesome5, iconName: "passport", size: 32 },
    { name: "Ration Card", lib: MaterialCommunityIcons, iconName: "food-variant", size: 34 },
    { name: "Birth Certificate", lib: Ionicons, iconName: "document-text-outline", size: 30 },
    { name: "SSC Marksheet", lib: MaterialCommunityIcons, iconName: "certificate-outline", size: 34 },
    { name: "HSC Marksheet", lib: MaterialCommunityIcons, iconName: "school-outline", size: 36 },
    { name: "Domicile Certificate", lib: Ionicons, iconName: "home-outline", size: 34 },
    { name: "Caste Certificate", lib: MaterialCommunityIcons, iconName: "badge-account-outline", size: 36 },
    { name: "Other", lib: MaterialIcons, iconName: "folder", size: 34, multiUpload: true },
  ];

  const handlePress = (index) => {
    if (selectedDocs.includes(index)) {
      setSelectedDocs(selectedDocs.filter((i) => i !== index));
    } else {
      setSelectedDocs([...selectedDocs, index]);
    }    
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head1}>Select Documents</Text>
        <Text style={styles.head2}>
          to send <Text style={styles.name}>{item.name} !</Text>
        </Text>
      </View>

      <View style={styles.boxContainer}>
        {documents.map((doc, index) => {
          const isSelected = selectedDocs.includes(index);
          const iconColor = isSelected ? "green" : "black";
          const borderColor = isSelected ? "green" : "black";
          const Icon = doc.lib;
          return (
            <TouchableOpacity key={index} style={[styles.box, { borderColor: borderColor }]} onPress={()=>handlePress(index)}>
              <Icon name={doc.iconName} size={doc.size} color={iconColor} />
              <Text style={styles.docText}>{doc.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btntxt}>Send Documents</Text>
      </TouchableOpacity>

    </View>
  );
};

export default selectdoc;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 50,
    height: '100%',
  },
  head1: {
    fontSize: 35,
    fontWeight: "bold",
  },
  head2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  name: {
    color: "green",
  },
  boxContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: 90,
    width: "45%",
    margin: 5,
    padding: 9,
    gap: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "black",
  },
  docText: {
    textAlign: "center",
    fontSize: 14,
  },
  btn: {
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#c6d4f5'
  },
  btntxt: {
    fontWeight: 'bold',
  }
});
