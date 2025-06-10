import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import Entypo from '@expo/vector-icons/Entypo';
import { Animated } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [currUser, setCurrUser] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState(0);
  const [sharedDocs, setSharedDocs] = useState(0);
  const [receivedDocs, setReceivedDocs] = useState(0);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User Signed Out");
        router.replace("/auth/Login/Login");
      })
      .catch((error) => { });
  };

  const getUserData = async () => {
    try {
      const q = query(collection(db, "userinfo"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs[0].data();
        setCurrUser(userInfo);
        
        setUploadedDocs(userInfo.uploadedDocuments?.length || 0);
        

        const shareQuery = query(collection(db, "sendRequests"), 
          where("senderId", "==", user.uid),
          where("status", "==", "accepted"));
        const shareSnapshot = await getDocs(shareQuery);
        setSharedDocs(shareSnapshot.size);
        
    
        const receiveQuery = query(collection(db, "sendRequests"), 
          where("receiverId", "==", user.uid),
          where("status", "==", "accepted"));
        const receiveSnapshot = await getDocs(receiveQuery);
        setReceivedDocs(receiveSnapshot.size);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const q = query(collection(db, "userinfo"), where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          const userDocRef = doc(db, "userinfo", docId);

          await updateDoc(userDocRef, { profilePic: downloadURL });
          setCurrUser(prev => ({ ...prev, profilePic: downloadURL }));
        }
      } catch (error) {
        console.error("Error uploading or getting download URL:", error);
      }
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const MenuItem = ({ icon, title, onPress, color = "#3629B7" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3629B7" />

      <View style={styles.container1}>
        <Text style={styles.profileName}>PROFILE</Text>
        <TouchableOpacity style={styles.menu} onPress={toggleSidebar}>
          <Entypo name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container2} showsVerticalScrollIndicator={false}>
        <View style={styles.userInfoSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                currUser?.profilePic
                  ? { uri: currUser.profilePic }
                  : require("../../assets/images/User.png")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton} onPress={pickAndUploadImage}>
              <Feather name="edit-2" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userContent}>
            <Text style={styles.userName}>{currUser?.name}</Text>
            <Text style={styles.userHandle}>@{currUser?.username}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard 
            icon={<MaterialCommunityIcons name="file-document-outline" size={24} color="#4361EE" />}
            title="Uploaded"
            value={uploadedDocs}
            color="#4361EE"
          />
          <StatCard 
            icon={<Ionicons name="share-outline" size={24} color="#3DAA7D" />}
            title="Shared"
            value={sharedDocs}
            color="#3DAA7D"
          />
          <StatCard 
            icon={<Ionicons name="download-outline" size={24} color="#E9446A" />}
            title="Received"
            value={receivedDocs}
            color="#E9446A"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#3629B7" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{currUser?.username}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#3629B7" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{currUser?.email}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#3629B7" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{currUser?.number}</Text>
              </View>
            </View>
          </View>
        </View>
        
  
      </ScrollView>

      {sidebarVisible && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: opacityAnim,
            }
          ]}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
          
          <Animated.View 
            style={[
              styles.sidebar, 
              { 
                transform: [{ translateX: slideAnim }] 
              }
            ]}
          >
            <View style={styles.sidebarHeader}>
              <TouchableOpacity onPress={toggleSidebar}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.sidebarProfile}>
              <Image
                source={
                  currUser?.profilePic
                    ? { uri: currUser.profilePic }
                    : require("../../assets/images/User.png")
                }
                style={styles.sidebarProfileImage}
              />
              <Text style={styles.sidebarProfileName}>{currUser?.name}</Text>
              <Text style={styles.sidebarProfileEmail}>{currUser?.email}</Text>
            </View>
            
            <View style={styles.menuWrapper}>
              <TouchableOpacity 
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  router.push('/Pages/about');
                }}
              >
                <Ionicons name="information-circle-outline" size={24} color="#3629B7" />
                <Text style={styles.sidebarMenuText}>About</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  router.push('/Pages/help');
                }}
              >
                <Ionicons name="help-circle-outline" size={24} color="#3629B7" />
                <Text style={styles.sidebarMenuText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  router.push('/Pages/setting');
                }}
              >
                <Ionicons name="settings-outline" size={24} color="#3629B7" />
                <Text style={styles.sidebarMenuText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  router.push('/Pages/feedback');
                }}
              >
                <MaterialIcons name="feedback" size={24} color="#3629B7" />
                <Text style={styles.sidebarMenuText}>Send Feedback</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.sidebarLogoutButton} 
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={22} color="white" />
              <Text style={styles.sidebarLogoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3629B7",
  },
  container1: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: 'white',
  },
  menu: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3629B7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userContent: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    borderLeftWidth: 3,
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#888',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: "#ff4757",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 101,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  sidebarProfile: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  sidebarProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  sidebarProfileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sidebarProfileEmail: {
    fontSize: 14,
    color: '#888',
  },
  menuWrapper: {
    paddingHorizontal: 20,
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  sidebarMenuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  sidebarLogoutButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarLogoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});