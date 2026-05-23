import { useState } from "react";

import { uploadToCloudinary } from "../services/uploadService";
import { saveNote } from "../services/notesService";

import { useAuth } from "../context/AuthContext";

export default function UploadBox({ setRefresh }) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Current Logged In User
  const { user } = useAuth();

  const handleUpload = async () => {

    if (!file) {
      return alert("Please select a file first");
    }

    setLoading(true);

    try {

      // ✅ Upload file to Cloudinary
      const cloudRes = await uploadToCloudinary(file);

      // ✅ Save note metadata to Firestore
      await saveNote({

        title: file.name,

        url: cloudRes.secure_url,

        type: file.type,

        uploadedBy: {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
          avatar: user.photoURL || "",
        },

      });

      alert("Upload successful 🚀");
      setRefresh(prev => !prev);

      setFile(null);

    } catch (err) {

      console.log(err);

      alert("Upload failed");
    }

    setLoading(false);
  };

  return (

    <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border">

      {/* Heading */}
      <h3 className="text-2xl font-bold mb-2 text-gray-800">
        Upload Notes 📤
      </h3>

      <p className="text-gray-500 mb-5">
        Share notes with other students
      </p>

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border p-3 rounded-lg"
      />

      {/* Selected File */}
      {
        file && (
          <p className="mt-3 text-sm text-gray-600">
            Selected File:
            <span className="font-medium ml-1">
              {file.name}
            </span>
          </p>
        )
      }

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-5 bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-xl font-medium"
      >
        {
          loading
            ? "Uploading..."
            : "Upload Notes"
        }
      </button>

    </div>
  );
}