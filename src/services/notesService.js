import { db } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/* =========================================================
   ✅ UPLOAD NOTE
========================================================= */

export const saveNote = async (noteData) => {
  try {
    await addDoc(collection(db, "notes"), {
      ...noteData,

      formattedDate: new Date().toLocaleDateString(),
      formattedTime: new Date().toLocaleTimeString(),

      createdAt: serverTimestamp(),
    });

  } catch (error) {
    console.log("Error saving note:", error);
  }
};

/* =========================================================
   ✅ GET ALL NOTES
========================================================= */

export const getNotes = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, "notes")
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.log("Error fetching notes:", error);
    return [];
  }
};

/* =========================================================
   ✅ DELETE NOTE
========================================================= */

export const deleteNote = async (noteId) => {
  try {
    await deleteDoc(doc(db, "notes", noteId));

  } catch (error) {
    console.log("Error deleting note:", error);
  }
};

/* =========================================================
   ⭐ SAVE NOTE
========================================================= */

export const saveUserNote = async (userId, note) => {
  try {
    await setDoc(
      doc(
        db,
        "users",
        userId,
        "savedNotes",
        note.id
      ),
      {
        noteId: note.id,

        title: note.title || "Untitled",

        url: note.url || "",

        savedAt: serverTimestamp(),
      }
    );

  } catch (error) {
    console.log("Error saving note:", error);
  }
};

/* =========================================================
   ❌ UNSAVE NOTE
========================================================= */

export const unSaveUserNote = async (
  userId,
  noteId
) => {
  try {
    await deleteDoc(
      doc(
        db,
        "users",
        userId,
        "savedNotes",
        noteId
      )
    );

  } catch (error) {
    console.log("Error unsaving note:", error);
  }
};

/* =========================================================
   📌 GET SAVED NOTES
========================================================= */

export const getSavedNotes = async (userId) => {
  try {
    const snapshot = await getDocs(
      collection(
        db,
        "users",
        userId,
        "savedNotes"
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.log(
      "Error fetching saved notes:",
      error
    );

    return [];
  }
};