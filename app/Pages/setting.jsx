import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Switch,
    Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from "@/config/FirebaseConfig";
import { query, where, doc, updateDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

const Setting = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [profilePic, setProfilePic] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const q = query(
                    collection(db, "userinfo"),
                    where("id", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);

                const userInfo = querySnapshot.docs[0].data();
                if (userInfo) {
                    setProfilePic(userInfo.profilePic);
                    setNotificationsEnabled(userInfo.notificationsEnabled || true);
                    setBiometricEnabled(userInfo.biometricEnabled || false);
                    setDarkModeEnabled(userInfo.darkModeEnabled || false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        await auth.signOut();
                        router.replace("/auth/login");
                    }
                }
            ]
        );
    };

    const updateSetting = async (setting, value) => {
        if (!user) return;
        
        try {
            const q = query(
                collection(db, "userinfo"),
                where("id", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const docRef = doc(db, "userinfo", querySnapshot.docs[0].id);
                await updateDoc(docRef, {
                    [setting]: value
                });
            }
        } catch (error) {
            console.error("Error updating setting:", error);
            Alert.alert("Error", "Failed to update setting");
        }
    };

    const SettingItem = ({ icon, title, description, toggle, value, onValueChange }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
                {icon}
            </View>
            <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{title}</Text>
                {description && <Text style={styles.settingDescription}>{description}</Text>}
            </View>
            {toggle ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#d3d3d3", true: "#3629B7" }}
                    thumbColor={value ? "#fff" : "#f4f3f4"}
                />
            ) : (
                <Ionicons name="chevron-forward" size={24} color="#aaa" />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Image
                    source={
                        profilePic
                            ? { uri: profilePic }
                            : require("../../assets/images/User.png")
                    }
                    style={styles.img}
                />
                <Text style={styles.user}>Hii, {user?.displayName}</Text>
            </View>

            <View style={styles.container2}>
                <Text style={styles.head}>Settings</Text>
                
                <ScrollView style={styles.settingsScroll}>
                    <View style={styles.settingSection}>
                        <Text style={styles.sectionTitle}>Account</Text>
                        
                        <TouchableOpacity onPress={() => router.push("/Pages/profile")}>
                            <SettingItem
                                icon={<Ionicons name="person-outline" size={24} color="#3629B7" />}
                                title="Edit Profile"
                                description="Update your personal information"
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => router.push("/Pages/security")}>
                            <SettingItem
                                icon={<Ionicons name="lock-closed-outline" size={24} color="#3629B7" />}
                                title="Security"
                                description="Change password and security settings"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingSection}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        
                        <SettingItem
                            icon={<Ionicons name="notifications-outline" size={24} color="#3629B7" />}
                            title="Notifications"
                            description="Manage notification preferences"
                            toggle={true}
                            value={notificationsEnabled}
                            onValueChange={(value) => {
                                setNotificationsEnabled(value);
                                updateSetting("notificationsEnabled", value);
                            }}
                        />
                        
                        <SettingItem
                            icon={<Ionicons name="finger-print-outline" size={24} color="#3629B7" />}
                            title="Biometric Login"
                            description="Use fingerprint or face ID for login"
                            toggle={true}
                            value={biometricEnabled}
                            onValueChange={(value) => {
                                setBiometricEnabled(value);
                                updateSetting("biometricEnabled", value);
                            }}
                        />
                        
                        <SettingItem
                            icon={<Ionicons name="moon-outline" size={24} color="#3629B7" />}
                            title="Dark Mode"
                            description="Switch between light and dark theme"
                            toggle={true}
                            value={darkModeEnabled}
                            onValueChange={(value) => {
                                setDarkModeEnabled(value);
                                updateSetting("darkModeEnabled", value);
                            }}
                        />
                    </View>

                    <View style={styles.settingSection}>
                        <Text style={styles.sectionTitle}>Support</Text>
                        
                        <TouchableOpacity onPress={() => router.push("/Pages/help")}>
                            <SettingItem
                                icon={<Ionicons name="help-circle-outline" size={24} color="#3629B7" />}
                                title="Help & Support"
                                description="Get help and contact support"
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => router.push("/Pages/about")}>
                            <SettingItem
                                icon={<Ionicons name="information-circle-outline" size={24} color="#3629B7" />}
                                title="About"
                                description="App information and legal details"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3629B7",
        flex: 1,
    },
    container1: {
        height: "15%",
        display: "flex",
        flexDirection: "row",
    },
    img: {
        marginLeft: 30,
        marginTop: 45,
        height: 50,
        width: 50,
        borderRadius: 50
    },
    user: {
        marginLeft: 15,
        marginTop: 65,
        fontSize: 20,
        color: "white",
    },
    container2: {
        height: "85%",
        width: '100%',
        backgroundColor: "white",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        flex: 1,
    },
    head: {
        fontSize: 30,
        color: "black",
        marginTop: 30,
        marginBottom: 20,
        fontWeight: "bold",
        paddingLeft: 20,
    },
    settingsScroll: {
        flex: 1,
        paddingHorizontal: 15,
    },
    settingSection: {
        marginBottom: 25,
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
        marginLeft: 10,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 8,
    },
    settingIcon: {
        width: 40,
        alignItems: "center",
    },
    settingText: {
        flex: 1,
        marginLeft: 10,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    settingDescription: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
    },
    logoutButton: {
        backgroundColor: "#ff4757",
        paddingVertical: 15,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 8,
    },
});