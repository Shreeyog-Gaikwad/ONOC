import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, Alert, Vibration } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { auth } from "../../config/FirebaseConfig";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";


const OtherUpload = () => {
  const { name } = useLocalSearchParams();
  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDocUri, setNewDocUri] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [uploadedFileType, setUploadedFileType] = useState(null);



  const router = useRouter();

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

      const firestore = getFirestore();
      const userinfoRef = collection(firestore, "userinfo");
      const q = query(userinfoRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const uploadedDocs = userDoc.data().uploadedDocuments || [];

        const filteredDocs = uploadedDocs
          .filter(doc => doc.other === true)
          .map(doc => ({
            name: doc.name,
            downloadUrl: doc.path,
            firebasePath: doc.firebasePath || null,
          }));

        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error("Error fetching documents from Firestore:", error);
    } finally {
      setLoadingFile(false);
    }
  };


  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (!result.canceled) {
        const file = result.assets[0];
        setNewDocUri(file.uri);
        setNewFileName(file.name);
        setModalVisible(true);
        setUploadedFileType(file.mimeType);
      }

    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const saveDocument = async () => {
    const user = auth.currentUser;
    if (docName.trim() === "") {
      alert("Please enter a document name!");
      return;
    }
    try {
      setUploading(true);
      const storage = getStorage();
      const firebaseFileName = `documents/${user.email}/${docName}/${Date.now()}_${newFileName}`;
      const storageRef = ref(storage, firebaseFileName);
      const blob = await uriToBlob(newDocUri);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const firestore = getFirestore();
      const userinfoRef = collection(firestore, "userinfo");

      const q = query(userinfoRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(firestore, "userinfo", userDoc.id);

        await setDoc(userDocRef, {
          uploadedDocuments: [...(userDoc.data().uploadedDocuments || []), {
            name: docName,
            path: downloadURL,
            firebasePath: firebaseFileName, 
            type: uploadedFileType,
            uploadedAt: new Date().toISOString(),
            other: true,
          }],
        }, { merge: true });
      } else {
        console.error("User not found");
      }

      const updatedDocs = [...documents, {
        name: docName,
        downloadUrl: downloadURL,
        firebasePath: firebaseFileName,
      }];
      setDocuments(updatedDocs);

      setDocName("");
      setNewDocUri("");
      setNewFileName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (index) => {

    const user = auth.currentUser;

    Vibration.vibrate(50);
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              const docToDelete = documents[index];

              if (docToDelete.firebasePath) {
                const storage = getStorage();
                const fileRef = ref(storage, docToDelete.firebasePath);
                await deleteObject(fileRef);
              }

              const updatedDocs = documents.filter((_, i) => i !== index);
              setDocuments(updatedDocs);

              const firestore = getFirestore();
              const userinfoRef = collection(firestore, "userinfo");
              const q = query(userinfoRef, where("email", "==", user.email));
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const currentData = userDoc.data();
                const updatedDocuments = (currentData.uploadedDocuments || []).filter(
                  (doc) => doc.name !== documents[index].name
                );

                const userDocRef = doc(firestore, "userinfo", userDoc.id);
                await setDoc(userDocRef, { uploadedDocuments: updatedDocuments }, { merge: true });

                console.log("Firestore updated: Document reference removed.");
              }

            } catch (error) {
              console.error("Error deleting document:", error);
            }
          }
        }
      ]
    );
  };


  const renderItem = ({ item, index }) => (
    <View style={styles.docItem}>
      <TouchableOpacity
        style={styles.docContent}
        onPress={() => router.push({
          pathname: "/Pages/previewOther",
          params: { uri: item.downloadUrl },
        })}
      >
        <Text style={styles.docName}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteDocument(index)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name} Documents</Text>

      <TouchableOpacity style={styles.uploadBtn} onPress={uploadDocument}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Upload New Document</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />}

      <FlatList
        data={documents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Document Name</Text>
            <TextInput
              placeholder="Document Name"
              value={docName}
              onChangeText={setDocName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OtherUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
  uploadBtn: {
    backgroundColor: "#3629B7",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 30,
  },
  docItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  docContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  docName: {
    fontSize: 18,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  saveButton: {
    backgroundColor: "#04AA6D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

});
