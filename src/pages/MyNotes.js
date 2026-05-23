import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

import { useOutletContext } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const MyNotes = () => {
  const { searchTerm } =
    useOutletContext() || {};

  const { user } = useAuth();

  const [notes, setNotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ---------------- REALTIME MY NOTES ----------------
  useEffect(() => {
    if (!user?.uid) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const notesQuery = query(
      collection(db, "notes"),
      where(
        "uploadedByUid",
        "==",
        user.uid
      ),
      orderBy("createdAt", "desc")
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

      return title.includes(search);
    });

  // ---------------- DELETE ----------------
  const handleDelete =
    async (id) => {
      try {
        await deleteDoc(
          doc(db, "notes", id)
        );

        alert(
          "Note deleted successfully"
        );

      } catch (error) {
        console.log(error);

        alert(
          "Failed to delete note"
        );
      }
    };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading your notes...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-5">
        My Notes
      </h1>

      {/* EMPTY */}
      {filteredNotes.length ===
      0 ? (
        <p className="text-gray-400">
          No notes uploaded yet.
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
                <p className="text-sm text-gray-400 mt-1">
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

                  {/* DELETE */}
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

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default MyNotes;