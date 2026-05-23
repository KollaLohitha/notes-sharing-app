// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN_3DgA3jozGsSvVPOPb1Kc8OYNpExUoA",
  authDomain: "notes-platform-99186.firebaseapp.com",
  projectId: "notes-platform-99186",
  storageBucket: "notes-platform-99186.firebasestorage.app",
  messagingSenderId: "877925392189",
  appId: "1:877925392189:web:8ccf0d7345f1baa0542f54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();