import React, { useState, useEffect } from "react";
import { View,Text,StyleSheet,Button,Image,ActivityIndicator,TouchableOpacity,} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString,} from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { router, useRouter } from "expo-router";
import { auth } from "../../config/FirebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Upload() {
  const { name } = useLocalSearchParams();
  const [uploading, setUploading] = useState(false);
  const [uploadedFileType, setUploadedFileType] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    loadUploadedFile();
  }, []);

  const isPdf = uploadedImageUrl?.toLowerCase().includes('.pdf');

  const loadUploadedFile = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(`uploadedImageUrl_${name}`);
      const savedType = await AsyncStorage.getItem(`uploadedFileType_${name}`);
      if (savedUrl) {
        setUploadedImageUrl(savedUrl);
        setUploadedFileType(savedType);
      }
    } catch (error) {
      console.error("Error loading uploaded file from storage:", error);
    }
  };

  const saveUploadedFile = async (url, type) => {
    try {
      await AsyncStorage.setItem(`uploadedImageUrl_${name}`, url);
      if (type) {
        await AsyncStorage.setItem(`uploadedFileType_${name}`, type);
      }
    } catch (error) {
      console.error("Error saving uploaded file to storage:", error);
    }
  };

  const clearUploadedFile = async () => {
    try {
      await AsyncStorage.removeItem(`uploadedImageUrl_${name}`);
      await AsyncStorage.removeItem(`uploadedFileType_${name}`);
    } catch (error) {
      console.error("Error clearing uploaded file from storage:", error);
    }
  };
  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
  };
  const handleDelete = () => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setUploadedImageUrl(null);
            await clearUploadedFile();
            console.log("Image deleted successfully.");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleViewPdf = async () => {
    if (uploadedImageUrl) {
      await WebBrowser.openBrowserAsync(uploadedImageUrl);
    }
  };

  const selectDoc = async () => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.type === "cancel") {
        console.log("User cancelled the upload.");
        setUploading(false);
        return;
      }
      const fileUri =
        result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
      const fileMimeType =
        result.assets && result.assets.length > 0
          ? result.assets[0].mimeType
          : null;

      if (!fileUri) {
        console.log("No file selected or URI is missing.");
        setUploading(false);
        return;
      }

      console.log("Document selected", result);

      const storage = getStorage();
      const fileName = `uploads/${Date.now()}_${result.assets[0].name}`;
      const storageRef = ref(storage, fileName);
      const blob = await uriToBlob(fileUri);

      await uploadBytes(storageRef, blob);
      console.log("Upload complete (Blob)");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at", downloadURL);

      setUploadedImageUrl(downloadURL);
      setUploadedFileType(fileMimeType);
      await saveUploadedFile(downloadURL, fileMimeType);
    } catch (err) {
      console.error("Error picking/uploading document:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.outer}>
     <TouchableOpacity style={styles.backArrow}>
    <Ionicons name="arrow-back" size={30} color="black" onPress={()=> {router.back()}} />

    </TouchableOpacity>
    <View style={styles.container}>
      <Text style={styles.uploadText}>UPLOAD DOCUMENT PAGE</Text>
      <View>
        <Text style={styles.typeText}>Document Type : {name}</Text>
      </View>
      <TouchableOpacity
        style={[styles.uploadBtn, { display: uploadedImageUrl ? "none" : "flex" }]}
        onPress={selectDoc}>
        {/* <Button title="Select & Upload Document" /> */}
        <Text style={{ color: "white", fontWeight: "bold" , fontSize : 16 }}>Select & Upload Document</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deletebtn, { display: uploadedImageUrl ? "flex" : "none" }]}
        onPress={handleDelete}
          disabled={uploading || uploadedImageUrl === null}>
        {/* <Button
          title="Delete Uploaded Image"
          onPress={handleDelete}
          disabled={uploading || uploadedImageUrl === null}
          color="red"
        /> */}
        <Text style={{ color: "white", fontWeight: "bold" , fontSize : 16 }}>Delete Uploaded Image</Text>
      </TouchableOpacity>
      {uploading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      )}

      {uploadedImageUrl && (
        <View style={styles.imgSize}>
          {!isPdf ? (
            <Image
              source={{ uri: uploadedImageUrl }}
              style={styles.imgSize}
              resizeMode="contain"
            />
          ) : (
            <View style={{ alignItes: "center", marginTop: 20 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                PDF Document Uploaded 📄
              </Text>
              <Button title="View PDF" onPress={handleViewPdf} />
            </View>
          )}
        </View>
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer :{
    position: 'relative',
  },
  container: {
    paddingTop: 100,
    height: "104%",
    width : "100%",
    backgroundColor: "white",
    display : 'flex',
    alignItems: "center",
  },
  backArrow :{
    position: 'absolute',
    top: 45,  
    left: 5, 
    zIndex: 100, 
    padding: 19, 

  },
  uploadText: {
    fontSize: 23,
    marginBottom: 20,
    fontWeight: "700",
  },
  typeText: {
    fontSize: 17,
    fontWeight : 'bold'
  },
  btn: {
    marginTop: 30,
  },
  selectbtn :{
    padding : 30,
    width : '80%',
   
  },
  uploadBtn: {
    backgroundColor: "#3629B7",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    margin : 17,
  },
  deletebtn: {
    backgroundColor: "red",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    margin : 17,
  },
  imgSize: {
    width: "100%",
    height: "80%",
    display : 'flex',
    alignItems : 'center',
    padding : 15,
    marginTop: 4,
    borderRadius: 10,
  },
  
});
