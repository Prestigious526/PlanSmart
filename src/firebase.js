// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnNcLv0PXF46MKkg20bJJVNZyLXfQ4U8k",
  authDomain: "financial-advisor-42d81.firebaseapp.com",
  projectId: "financial-advisor-42d81",
  storageBucket: "financial-advisor-42d81.firebasestorage.app",
  messagingSenderId: "929375506153",
  appId: "1:929375506153:web:70cb7114aee84662f72a78",
  measurementId: "G-WX2MWZHY8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Firestore = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
// Firestore reference
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

