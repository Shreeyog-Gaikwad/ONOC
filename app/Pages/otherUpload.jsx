import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  StatusBar,
  Vibration,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { auth, db } from "@/config/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const OtherUpload = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [docName, setDocName] = useState("");
  const [newDocUri, setNewDocUri] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchUploadedFile();
    }, [])
  );

  const isPdf = uploadedImageUrl?.toLowerCase().includes(".pdf");

  const fetchUploadedFile = async () => {
    try {
      setUploading(true);
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "userinfo"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const uploadedDocuments = userData.uploadedDocuments || [];
        const otherDocs = uploadedDocuments.filter((doc) => doc.other === true);

        setDocuments(otherDocs);
      }
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const selectedAsset = result.assets[0];
        setNewDocUri(selectedAsset.uri);
        setNewFileName(selectedAsset.name);

        const fileExtension = selectedAsset.name.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') {
          setUploadedFileType('pdf');
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          setUploadedFileType('image');
        } else {
          setUploadedFileType('document');
        }

        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error picking document:", error);
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
      Alert.alert("Error", "Please enter a document name");
      return;
    }
    
    setUploading(true);
    
    try {
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
        
        await setDoc(
          userDocRef,
          {
            uploadedDocuments: [
              ...(userDoc.data().uploadedDocuments || []),
              {
                name: docName,
                path: downloadURL,
                firebasePath: firebaseFileName,
                type: uploadedFileType,
                uploadedAt: new Date().toISOString(),
                other: true,
              },
            ],
          },
          { merge: true }
        );

        const updatedDocs = [
          ...documents, 
          {
            name: docName,
            downloadUrl: downloadURL,
            firebasePath: firebaseFileName,
            type: uploadedFileType,
            uploadedAt: new Date().toISOString(),
          }
        ];
        
        setDocuments(updatedDocs);
        Alert.alert("Success", "Document uploaded successfully");
      } else {
        Alert.alert("Error", "User not found");
      }

      setDocName("");
      setNewDocUri("");
      setNewFileName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error uploading document:", error);
      Alert.alert("Error", "Failed to upload document");
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
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const docToDelete = documents[index];

              if (docToDelete.firebasePath) {
                const storage = getStorage();
                const storageRef = ref(storage, docToDelete.firebasePath);
                try {
                  await deleteObject(storageRef);
                  console.log("File deleted from storage");
                } catch (storageError) {
                  console.error("Error deleting file from storage:", storageError);
                }
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
                await setDoc(
                  userDocRef, 
                  { uploadedDocuments: updatedDocuments }, 
                  { merge: true }
                );

                Alert.alert("Success", "Document deleted successfully");
                console.log("Firestore updated: Document reference removed.");
              }
            } catch (error) {
              console.error("Error deleting document:", error);
              Alert.alert("Error", "Failed to delete document");
            }
          },
        },
      ]
    );
  };

  const getFileIcon = (type) => {
    if (type === 'pdf') {
      return <MaterialCommunityIcons name="file-pdf-box" size={32} color="#E9446A" />;
    } else if (type === 'image') {
      return <MaterialCommunityIcons name="file-image" size={32} color="#4361EE" />;
    } else {
      return <MaterialCommunityIcons name="file-document-outline" size={32} color="#3629B7" />;
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.docItem}>
      <TouchableOpacity
        style={styles.docContent}
        onPress={() =>
          router.push({
            pathname: "/Pages/preview",
            params: {
              uri: item.downloadUrl || item.path,
              type: item.type || "application/octet-stream",
            },
          })
        }
      >
        <View style={styles.docIconContainer}>
          {getFileIcon(item.type)}
        </View>
        
        <View style={styles.docDetails}>
          <Text style={styles.docName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.docDate}>
            {new Date(item.uploadedAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteDocument(index)}
        >
          <Ionicons name="trash-outline" size={22} color="#E9446A" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3629B7" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name || "Other"} Documents</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.uploadBtn} 
            onPress={uploadDocument}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text style={styles.uploadBtnText}>Upload New Document</Text>
          </TouchableOpacity>
        </View>

        {uploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3629B7" />
            <Text style={styles.loadingText}>
              {modalVisible ? "Uploading document..." : "Loading documents..."}
            </Text>
          </View>
        )}

        {documents.length === 0 && !uploading ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="file-document-outline" 
              size={60} 
              color="#ccc" 
            />
            <Text style={styles.emptyText}>No documents found</Text>
            <Text style={styles.emptySubtext}>
              Upload your first document using the button above
            </Text>
          </View>
        ) : (
          <FlatList
            data={documents}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Document Details</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Document Name*</Text>
                  <TextInput
                    placeholder="Enter document name"
                    value={docName}
                    onChangeText={setDocName}
                    style={styles.input}
                  />
                </View>
                
                <View style={styles.filePreview}>
                  <Text style={styles.fieldLabel}>Selected File</Text>
                  <View style={styles.filePreviewContent}>
                    {getFileIcon(uploadedFileType)}
                    <Text style={styles.fileName} numberOfLines={1}>
                      {newFileName}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={saveDocument}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default OtherUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3629B7",
  },
  header: {
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  uploadBtn: {
    flexDirection: "row",
    backgroundColor: "#3629B7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3629B7",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  docItem: {
    marginBottom: 12,
  },
  docContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  docIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  docDetails: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  docDate: {
    fontSize: 12,
    color: "#888",
  },
  deleteButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  filePreview: {
    marginBottom: 10,
  },
  filePreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#3629B7",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});