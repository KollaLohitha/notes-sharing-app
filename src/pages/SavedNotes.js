import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SavedNotes = () => {
  const { searchTerm } = useOutletContext() || {};
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    const savedNotesRef = collection(
      db,
      "users",
      user.uid,
      "savedNotes"
    );

    const unsubscribe = onSnapshot(
      savedNotesRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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

  const search = (searchTerm || "").toLowerCase();

  const filteredNotes = notes.filter((note) => {
    const title = (note?.title || "").toLowerCase();
    return title.includes(search);
  });

  if (loading) {
    return <div className="p-6 text-white">Loading saved notes...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Saved Notes
      </h1>

      {filteredNotes.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh] text-gray-400 text-lg">
          No saved notes found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800"
            >
              <h3 className="font-semibold">
                {note.title}
              </h3>

              <a
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm mt-2 inline-block hover:underline"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedNotes;