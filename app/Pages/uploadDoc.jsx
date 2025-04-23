import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {Avatar} from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router';

export default function DocumentPickerScreen() {

  const {name} = useLocalSearchParams();
  const [doc, setDoc] = useState(true);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ["image/*", "application/pdf"], // accepts images and PDFs
        multiple: false,
      });

      if (result.type === "success") {
        setDoc(result);
      }
    } catch (err) {
      console.warn("Document pick error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>

      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
        <Text style={styles.uploadText}>Choose File</Text>
      </TouchableOpacity>

      <View>
        <Text>Document Type : {name}</Text>
      </View>

      {doc && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>Preview:</Text>
          {doc.assets?.[0].mimeType?.includes("image") ? (
            <Image
              source={{ uri: doc.assets[0].uri }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.pdfText}>📄 PDF File: {doc.assets?.[0].name}</Text>
          )}
        </View>
      )}

     
    </View>
  );
}



 

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: "#fff",
    height: "100%",
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: 150
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: 'center',
  },
  previewBox: {
    width: "80%",
    height: '50%',
    backgroundColor: 'rgb(224, 224, 224)',
    marginTop: 20,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 400,
    padding : 100,
    borderRadius: 10,
  },
  pdfText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});
