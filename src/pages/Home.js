import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../firebase";

import { useOutletContext } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  deleteNote,
  saveUserNote,
  unSaveUserNote,
} from "../services/notesService";

const Home = () => {
  const outlet = useOutletContext();

  const searchTerm =
    outlet?.searchTerm || "";

  const { user } = useAuth();

  const [notes, setNotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [savedNotesIds, setSavedNotesIds] =
    useState([]);

  // ---------------- REALTIME NOTES ----------------
  useEffect(() => {
    const notesQuery = query(
      collection(db, "notes"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe =
      onSnapshot(
        notesQuery,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setNotes(data);

          setLoading(false);
        },
        (error) => {
          console.log(error);

          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // ---------------- REALTIME SAVED NOTES ----------------
  useEffect(() => {
    if (!user?.uid) {
      setSavedNotesIds([]);
      return;
    }

    const savedNotesRef =
      collection(
        db,
        "users",
        user.uid,
        "savedNotes"
      );

    const unsubscribe =
      onSnapshot(
        savedNotesRef,
        (snapshot) => {
          const ids =
            snapshot.docs.map(
              (doc) =>
                doc.data().noteId
            );

          setSavedNotesIds(ids);
        },
        (error) => {
          console.log(error);
        }
      );

    return () => unsubscribe();
  }, [user?.uid]);

  // ---------------- SEARCH ----------------
  const search = String(
    searchTerm || ""
  ).toLowerCase();

  const filteredNotes =
    notes.filter((note) => {
      const title = String(
        note?.title || ""
      ).toLowerCase();

      const uploader = String(
        note?.uploadedByName ||
          ""
      ).toLowerCase();

      return (
        title.includes(search) ||
        uploader.includes(search)
      );
    });

  // ---------------- DELETE ----------------
  const handleDelete =
    async (id) => {
      try {
        await deleteNote(id);
      } catch (error) {
        console.log(error);
      }
    };

  // ---------------- SAVE / UNSAVE ----------------
  const handleSaveToggle =
    async (note) => {
      if (!user?.uid) {
        alert(
          "Please login first"
        );

        return;
      }

      try {
        const isSaved =
          savedNotesIds.includes(
            note.id
          );

        if (isSaved) {
          await unSaveUserNote(
            user.uid,
            note.id
          );
        } else {
          await saveUserNote(
            user.uid,
            note
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      {/* WELCOME */}
      {!searchTerm && (
        <div className="mb-6">
          <h1 className="text-4xl font-bold">
            Welcome 👋
          </h1>

          <p className="text-gray-400">
            Share and explore
            academic notes.
          </p>
        </div>
      )}

      {/* HEADING */}
      <h2 className="text-2xl font-semibold mb-4">
        {search
          ? "Search Results"
          : "Recent Notes"}
      </h2>

      {/* EMPTY */}
      {filteredNotes.length ===
      0 ? (
        <p className="text-gray-400">
          No notes found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredNotes.map(
            (note) => (
              <div
                key={note.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800"
              >

                {/* TITLE */}
                <h3 className="font-semibold text-lg">
                  {note?.title ||
                    "Untitled"}
                </h3>

                {/* UPLOADER */}
                <p className="text-sm text-gray-400">
                  Uploaded by{" "}
                  {note?.uploadedByName ||
                    "Unknown"}
                </p>

                {/* DATE */}
                <p className="text-xs text-gray-500 mt-1">
                  {note?.formattedDate ||
                    ""}
                </p>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {/* OPEN PDF */}
                  <a
                    href={
                      note?.viewUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Open
                  </a>

                  {/* DOWNLOAD PDF */}
                  <a
                    href={
                      note?.downloadUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    download={
                      note?.fileName ||
                      `${note?.title}.pdf`
                    }
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Download
                  </a>

                  {/* SAVE */}
                  <button
                    onClick={() =>
                      handleSaveToggle(
                        note
                      )
                    }
                    className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    {savedNotesIds.includes(
                      note.id
                    )
                      ? "Saved ✓"
                      : "Save"}
                  </button>

                  {/* DELETE */}
                  {note?.uploadedByUid ===
                    user?.uid && (
                    <button
                      onClick={() =>
                        handleDelete(
                          note.id
                        )
                      }
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}
    </div>
  );
};

export default Home;