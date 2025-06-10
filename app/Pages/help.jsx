import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Linking
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

const Help = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [profilePic, setProfilePic] = useState(null);

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
                }
            }
        };

        fetchUserData();
    }, [user]);

    const HelpSection = ({ title, children }) => (
        <View style={styles.helpSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const HelpItem = ({ icon, title, onPress }) => (
        <TouchableOpacity style={styles.helpItem} onPress={onPress}>
            <View style={styles.helpIcon}>
                {icon}
            </View>
            <Text style={styles.helpText}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
    );

    const FAQItem = ({ question, answer }) => {
        const [expanded, setExpanded] = useState(false);
        
        return (
            <TouchableOpacity 
                style={styles.faqItem} 
                onPress={() => setExpanded(!expanded)}
            >
                <View style={styles.faqQuestion}>
                    <Text style={styles.questionText}>{question}</Text>
                    <Ionicons 
                        name={expanded ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#3629B7" 
                    />
                </View>
                {expanded && (
                    <Text style={styles.answerText}>{answer}</Text>
                )}
            </TouchableOpacity>
        );
    };

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
                <Text style={styles.head}>Help & Support</Text>

                <ScrollView style={styles.helpScroll}>
                    <HelpSection title="Contact Support">
                        <HelpItem
                            icon={<Ionicons name="mail-outline" size={24} color="#3629B7" />}
                            title="Email Us"
                            onPress={() => Linking.openURL('mailto:support@onoc.com')}
                        />
        
                    </HelpSection>

                    <HelpSection title="Frequently Asked Questions">
                        <FAQItem 
                            question="How do I upload a document?" 
                            answer="To upload a document, go to the home screen and tap on the document type you want to upload. Then tap the 'Upload New Document' button and select the file from your device."
                        />
                        <FAQItem 
                            question="How can I share my documents?" 
                            answer="To share a document, navigate to the document you want to share, tap on it, and select the 'Share' option. You can then choose to share via email, message, or generate a secure link."
                        />
                        <FAQItem 
                            question="Is my data secure?" 
                            answer="Yes, all your documents are encrypted and stored securely in our cloud storage. We use industry-standard security protocols to ensure your data remains private and protected."
                        />
                        <FAQItem 
                            question="How do I delete a document?" 
                            answer="To delete a document, find it in your document list, tap on it, and press the trash icon. You'll be asked to confirm the deletion before the document is permanently removed."
                        />
                        <FAQItem 
                            question="Can I use ONOC offline?" 
                            answer="Some features of ONOC work offline, but you'll need an internet connection to upload, download, or share documents. Documents you've previously accessed may be available offline depending on your settings."
                        />
                    </HelpSection>


                    <TouchableOpacity 
                        style={styles.feedbackButton}
                        onPress={() => router.push("/Pages/feedback")}
                    >
                        <MaterialIcons name="feedback" size={20} color="#fff" />
                        <Text style={styles.feedbackText}>Send Feedback</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default Help;

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
    helpScroll: {
        flex: 1,
        paddingHorizontal: 15,
    },
    helpSection: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
        marginLeft: 10,
    },
    sectionContent: {
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        padding: 10,
    },
    helpItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 8,
    },
    helpIcon: {
        width: 40,
        alignItems: "center",
    },
    helpText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    faqItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 8,
    },
    faqQuestion: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        flex: 1,
        paddingRight: 10,
    },
    answerText: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        lineHeight: 20,
    },
    feedbackButton: {
        backgroundColor: "#3629B7",
        paddingVertical: 15,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    feedbackText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 8,
    },
});