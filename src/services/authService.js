import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";


// 👤 CREATE USER IN FIRESTORE
const createUserDocument = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "New User",
      email: user.email,
      avatar: user.photoURL || "",
      createdAt: new Date()
    });
  }
};

// 🔵 GOOGLE LOGIN
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user);
  return result.user;
};

// ✉️ SIGN UP
export const signupUser = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(result.user, {
    displayName: name
  });

  await setDoc(doc(db, "users", result.user.uid), {
    uid: result.user.uid,
    name,
    email,
    avatar: "",
    createdAt: new Date()
  });

  return result.user;
};

// 🔐 LOGIN
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 🔁 FORGOT PASSWORD
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
  return await signOut(auth);
};