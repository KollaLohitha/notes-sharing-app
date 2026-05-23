import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import app from "./config";

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    console.log("USER:", user);

    alert(`Welcome ${user.displayName}`);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};