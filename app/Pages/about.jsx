import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Linking,
    Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { auth, db } from "@/config/FirebaseConfig";
import { query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

const About = () => {
    const router = useRouter();
    const user = auth.currentUser;
    const [profilePic, setProfilePic] = useState(null);
    const appVersion = "1.2.0"; 

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

    const Section = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const TeamMember = ({ name, role, image, linkedin }) => (
        <TouchableOpacity 
            style={styles.teamMember} 
            onPress={() => linkedin && Linking.openURL(linkedin)}
        >
            <View style={styles.teamMemberImageContainer}>
                <Image 
                    source={image} 
                    style={styles.teamMemberImage} 
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.teamMemberName}>{name}</Text>
            <Text style={styles.teamMemberRole}>{role}</Text>
            {linkedin && (
                <AntDesign name="linkedin-square" size={20} color="#0077B5" style={styles.linkedinIcon} />
            )}
        </TouchableOpacity>
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
                <Text style={styles.head}>About ONOC</Text>
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require("../../assets/images/icon.png")} 
                            style={styles.appLogo}
                        />
                        <Text style={styles.appName}>One Nation One Card</Text>
                        <Text style={styles.appVersion}>Version {appVersion}</Text>
                    </View>

                    <Section title="Our Mission">
                        <Text style={styles.paragraph}>
                            At ONOC, we are on a mission to revolutionize how people manage their 
                            important documents. We believe in creating a secure, accessible, and 
                            user-friendly platform where individuals can store, share, and verify 
                            their official documents with ease and confidence.
                        </Text>
                    </Section>

                    <Section title="About the App">
                        <Text style={styles.paragraph}>
                            One Nation One Card (ONOC) is a comprehensive document management solution 
                            that allows users to digitize and securely store all their important 
                            documents in one place. From government IDs to certificates and personal 
                            records, ONOC provides a secure vault for all your documents.
                        </Text>
                        
                        <View style={styles.featuresContainer}>
                            <View style={styles.featureItem}>
                                <Ionicons name="shield-checkmark" size={32} color="#3629B7" style={styles.featureIcon} />
                                <Text style={styles.featureTitle}>Secure Storage</Text>
                                <Text style={styles.featureDescription}>
                                    End-to-end encryption for all your documents
                                </Text>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <Ionicons name="share-social" size={32} color="#3629B7" style={styles.featureIcon} />
                                <Text style={styles.featureTitle}>Easy Sharing</Text>
                                <Text style={styles.featureDescription}>
                                    Share documents with verified users securely
                                </Text>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <Ionicons name="scan" size={32} color="#3629B7" style={styles.featureIcon} />
                                <Text style={styles.featureTitle}>RFID Integration</Text>
                                <Text style={styles.featureDescription}>
                                    Connect your documents to physical RFID cards
                                </Text>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <Ionicons name="finger-print" size={32} color="#3629B7" style={styles.featureIcon} />
                                <Text style={styles.featureTitle}>Biometric Security</Text>
                                <Text style={styles.featureDescription}>
                                    Access your documents with fingerprint or face ID
                                </Text>
                            </View>
                        </View>
                    </Section>

                    <Section title="Our Team">
                        <Text style={styles.paragraph}>
                            ONOC is built by a team of passionate developers and designers who believe 
                            in the power of technology to simplify people's lives.
                        </Text>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
                            <TeamMember 
                                name="Shreeyog Gaikwad" 
                                role="Backend Developer" 
                                image={require("../../assets/images/Shree.jpg")} 
                                linkedin="https://www.linkedin.com/in/shreeyog-gaikwad-2171ab233?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "
                            />
                            <TeamMember 
                                name="Srushti Shinde" 
                                role="UI/UX Designer" 
                                image={require("../../assets/images/srushti.jpg")} 
                                linkedin="https://www.linkedin.com/in/srushti-shinde-02b273267/"
                            />
                            <TeamMember 
                                name="Prathamesh Sakhare" 
                                role="System Designer" 
                                image={require("../../assets/images/User.png")} 
                                linkedin="https://www.linkedin.com/in/prathamesh-sakhare-2a52312a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "
                            />
                            <TeamMember 
                                name="Sakshi Walunjkar" 
                                role="Tester" 
                                image={require("../../assets/images/sakshi.jpg")} 
                                linkedin="https://www.linkedin.com/in/sakshi-walunjkar-170a36275?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "
                            />
                        </ScrollView>
                    </Section>

                    {/* <Section title="Privacy & Security">
                        <Text style={styles.paragraph}>
                            At ONOC, we take your privacy and data security extremely seriously. 
                            All documents are encrypted using industry-standard protocols, and 
                            we never share your information with third parties without your 
                            explicit consent.
                        </Text>
                        
                        <TouchableOpacity 
                            style={styles.linkButton}
                            onPress={() => Linking.openURL('https://onoc.com/privacy-policy')}
                        >
                            <Text style={styles.linkText}>View Privacy Policy</Text>
                            <Ionicons name="open-outline" size={16} color="#3629B7" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.linkButton}
                            onPress={() => Linking.openURL('https://onoc.com/terms-of-service')}
                        >
                            <Text style={styles.linkText}>Terms of Service</Text>
                            <Ionicons name="open-outline" size={16} color="#3629B7" />
                        </TouchableOpacity>
                    </Section> */}

                    {/* <Section title="Contact Us">
                        <Text style={styles.paragraph}>
                            We'd love to hear from you! If you have any questions, feedback, 
                            or suggestions, please don't hesitate to reach out to us.
                        </Text>
                        
                        <View style={styles.contactItem}>
                            <Ionicons name="mail-outline" size={20} color="#3629B7" />
                            <Text style={styles.contactText}>support@onoc.com</Text>
                        </View>
                        
                        <View style={styles.contactItem}>
                            <Ionicons name="call-outline" size={20} color="#3629B7" />
                            <Text style={styles.contactText}>+91 9876543210</Text>
                        </View>
                        
                        <View style={styles.contactItem}>
                            <Ionicons name="location-outline" size={20} color="#3629B7" />
                            <Text style={styles.contactText}>123 Tech Park, Mumbai, India</Text>
                        </View>
                    </Section> */}

                    {/* <View style={styles.socialMediaContainer}>
                        <TouchableOpacity 
                            style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
                            onPress={() => Linking.openURL('https://facebook.com/onocapp')}
                        >
                            <FontAwesome name="facebook" size={20} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                            onPress={() => Linking.openURL('https://twitter.com/onocapp')}
                        >
                            <FontAwesome name="twitter" size={20} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.socialButton, { backgroundColor: '#C13584' }]}
                            onPress={() => Linking.openURL('https://instagram.com/onocapp')}
                        >
                            <FontAwesome name="instagram" size={20} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.socialButton, { backgroundColor: '#0A66C2' }]}
                            onPress={() => Linking.openURL('https://linkedin.com/company/onocapp')}
                        >
                            <FontAwesome name="linkedin" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View> */}

                    <Text style={styles.copyright}>
                        © 2025 One Nation One Card. All rights reserved.
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
};

export default About;

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
        marginBottom: 10,
        fontWeight: "bold",
        paddingLeft: 20,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 25,
    },
    appLogo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3629B7',
        marginBottom: 5,
    },
    appVersion: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#3629B7',
        paddingLeft: 10,
    },
    sectionContent: {
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 15,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 15,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    featureItem: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featureIcon: {
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    featureDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    teamScroll: {
        marginTop: 15,
        marginBottom: 10,
    },
    teamMember: {
        width: 120,
        marginRight: 15,
        alignItems: 'center',
    },
    teamMemberImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    teamMemberImage: {
        width: 80,
        height: 80,
    },
    teamMemberName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    teamMemberRole: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    linkedinIcon: {
        marginTop: 5,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    linkText: {
        flex: 1,
        fontSize: 15,
        color: '#3629B7',
        fontWeight: '500',
    },
    // contactItem: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 12,
    // },
    // contactText: {
    //     fontSize: 15,
    //     color: '#555',
    //     marginLeft: 10,
    // },
    // socialMediaContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     marginVertical: 20,
    // },
    // socialButton: {
    //     width: 45,
    //     height: 45,
    //     borderRadius: 23,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginHorizontal: 10,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 2,
    // },
    copyright: {
        textAlign: 'center',
        fontSize: 13,
        color: '#888',
        marginBottom: 30,
    },
});