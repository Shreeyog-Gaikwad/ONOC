// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGRrFpJT4ekEWCUGqf_UTHfLh3cq53_nw",
    authDomain: "one-nation-one-card.firebaseapp.com",
    projectId: "one-nation-one-card",
    storageBucket: "one-nation-one-card.firebasestorage.app",
    messagingSenderId: "745040048967",
    appId: "1:745040048967:web:1ae895ca2d7e48863c5262",
    measurementId: "G-44B4JCPXQ8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();