import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { auth } from "../../config/FirebaseConfig";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function Upload() {
  const { name } = useLocalSearchParams();
  const [uploading, setUploading] = useState(false);
  const [uploadedFileType, setUploadedFileType] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loadingFile, setLoadingFile] = useState(true);
  

  useFocusEffect(
    useCallback(() => {
      fetchUploadedFile();
    }, [])
  );
  

  const isPdf = uploadedImageUrl?.toLowerCase().includes(".pdf");

  const fetchUploadedFile = async () => {
    try {
      setLoadingFile(true);
      const user = auth.currentUser;
      if (!user) return;

      const storage = getStorage();
      const userFolderRef = ref(storage, `uploads/${user.uid}/${name}/`);
      const result = await listAll(userFolderRef);

      if (result.items.length > 0) {
        const fileRef = result.items[0];
        const url = await getDownloadURL(fileRef);
        const metadata = await getMetadata(fileRef);
        setUploadedImageUrl(url);
        setUploadedFileType(metadata.contentType);
      } else {
        setUploadedImageUrl(null);
        setUploadedFileType(null);
      }
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
    } finally {
      setLoadingFile(false);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;
            if (!user || !uploadedImageUrl) return;
  
            try {
              setUploading(true);
              setUploadedImageUrl(null);
              setUploadedFileType(null);
  
              const pathMatch = uploadedImageUrl.match(/\/o\/(.*?)\?/);
              const filePath = pathMatch
                ? decodeURIComponent(pathMatch[1])
                : null;
  
              if (filePath) {
                const storage = getStorage();
                const fileRef = ref(storage, filePath);
                await deleteObject(fileRef);
                console.log("File deleted.");
              }
            } catch (error) {
              console.error("Error deleting file:", error);
              await fetchUploadedFile();
            } finally {
              setUploading(false);
            }
          },
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
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in.");
      return;
    }
  
    try {
      setUploading(true);
  
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (result.type === "cancel") {
        console.log("User cancelled document picker.");
        return;
      }
  
      const fileUri = result.assets?.[0]?.uri;
      const fileMimeType = result.assets?.[0]?.mimeType;
      const fileName = result.assets?.[0]?.name;
  
      if (!fileUri || !fileName) {
        console.log("Invalid file selected.");
        return;
      }
  
      const tempUrl = fileUri;
      setUploadedImageUrl(tempUrl);
      setUploadedFileType(fileMimeType);
  
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `uploads/${user.uid}/${name}/${Date.now()}_${fileName}`
      );
      const blob = await uriToBlob(fileUri);
      await uploadBytes(storageRef, blob);
  
      const downloadURL = await getDownloadURL(storageRef);
      setUploadedImageUrl(downloadURL);
      setUploadedFileType(fileMimeType);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <View style={styles.outer}>
      <TouchableOpacity style={styles.backArrow}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          onPress={() => {
            router.back();
          }}
        />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.uploadText}>UPLOAD DOCUMENT PAGE</Text>
        <Text style={styles.typeText}>Document Type : {name}</Text>
        {!loadingFile && (
  uploadedImageUrl ? (
    <TouchableOpacity style={styles.deletebtn} onPress={handleDelete}>
      <Text style={styles.buttonText}>Delete Uploaded Document</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.uploadBtn} onPress={selectDoc}>
      <Text style={styles.buttonText}>Select & Upload Document</Text>
    </TouchableOpacity>
  )
)}


        {uploading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: 20 }}
          />
        )}

        {uploadedImageUrl && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            {!isPdf ? (
              <>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>
                  Image Preview:
                </Text>
                <Image
                  source={{ uri: uploadedImageUrl }}
                  style={{ width: 300, height: 400 }}
                  resizeMode="contain"
                />
              </>
            ) : (
              <>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>
                  PDF Document Uploaded 📄
                </Text>
                <TouchableOpacity
                  style={styles.viewPdfBtn}
                  onPress={handleViewPdf}
                >
                  <Text style={styles.buttonText}>View PDF</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "relative",
  },
  container: {
    paddingTop: 100,
    height: "104%",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  },
  backArrow: {
    position: "absolute",
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
    fontWeight: "bold",
  },
  uploadBtn: {
    backgroundColor: "#3629B7",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    margin: 17,
  },
  deletebtn: {
    backgroundColor: "red",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    margin: 17,
  },
  viewPdfBtn: {
    backgroundColor: "#3629B7",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
