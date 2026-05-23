import { useEffect, useState } from "react";

import {
  getNotes,
  deleteNote,
  saveUserNote,
} from "../services/notesService";

import { useAuth } from "../context/AuthContext";

export default function NotesSection({
  refresh,
  searchTerm,
}) {

  const [notes, setNotes] = useState([]);

  const { user } = useAuth();

  // ✅ Fetch Notes
  useEffect(() => {

    const fetchData = async () => {

      const data = await getNotes();

      setNotes(data);
    };

    fetchData();

  }, [refresh]);



  // ✅ DELETE NOTE
  const handleDelete = async (noteId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {

      await deleteNote(noteId);

      setNotes(
        notes.filter((note) => note.id !== noteId)
      );

    } catch (err) {

      console.log(err);

      alert("Failed to delete note");
    }
  };



  // ✅ SAVE NOTE
  const handleSaveNote = async (
    noteId
  ) => {

    try {

      await saveUserNote(
        user.uid,
        noteId
      );

      alert("Note saved ⭐");

    } catch (err) {

      console.log(err);

      alert("Failed to save note");
    }
  };



  // ✅ SEARCH FILTER
  const filteredNotes = notes.filter((note) => {

    const titleMatch =
      note.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const userMatch =
      note.uploadedBy?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return titleMatch || userMatch;
  });



  return (

    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-2xl font-bold text-gray-800">
          Recent Notes 📚
        </h3>

        <p className="text-sm text-gray-500">
          {filteredNotes.length} Notes
        </p>

      </div>



      {/* Empty State */}
      {
        filteredNotes.length === 0 ? (

          <p className="text-gray-500">
            No notes found...
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {
              filteredNotes.map((note) => (

                <div
                  key={note.id}
                  className="border rounded-2xl p-5 shadow-sm hover:shadow-lg transition bg-gray-50"
                >

                  {/* Note Title */}
                  <h4 className="font-bold text-lg truncate text-gray-800">
                    📘 {note.title}
                  </h4>



                  {/* Uploaded By */}
                  <p className="text-sm text-gray-600 mt-3">
                    👤 Uploaded by:
                    <span className="font-medium ml-1">
                      {note.uploadedBy?.name || "Unknown"}
                    </span>
                  </p>



                  {/* Date */}
                  <p className="text-sm text-gray-500 mt-1">
                    📅 {note.formattedDate}
                  </p>



                  {/* Time */}
                  <p className="text-sm text-gray-500">
                    🕒 {note.formattedTime}
                  </p>



                  {/* File Type */}
                  <p className="text-sm text-gray-500 mt-2">
                    {note.type || "File"}
                  </p>



                  {/* Buttons */}
                  <div className="mt-5 flex flex-wrap gap-2">

                    {/* Open */}
                    <a
                      href={note.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Open
                    </a>



                    {/* Download */}
                    <a
                      href={note.url}
                      download
                      className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Download
                    </a>



                    {/* Save */}
                    <button
                      onClick={() => handleSaveNote(note.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-2 rounded-xl text-sm"
                    >
                      ⭐ Save
                    </button>



                    {/* Delete Only Owner */}
                    {
                      user?.uid === note.uploadedBy?.uid && (

                        <button
                          onClick={() => handleDelete(note.id)}
                          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-xl text-sm"
                        >
                          Delete
                        </button>

                      )
                    }

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </div>
  );
}