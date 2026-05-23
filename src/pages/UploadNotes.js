import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import { useAuth } from "../context/AuthContext";

const UploadNotes = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = "dcevzpbed";

  const UPLOAD_PRESET = "notes_upload";

  // ---------------- VALIDATE FILE ----------------
  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select a PDF file";
    }

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      return "Only PDF files are allowed";
    }

    const maxSize =
      10 * 1024 * 1024;

    if (
      selectedFile.size >
      maxSize
    ) {
      return "PDF size must be below 10MB";
    }

    return null;
  };

  // ---------------- HANDLE FILE CHANGE ----------------
  const handleFileChange = (
    e
  ) => {
    const selectedFile =
      e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
  };

  // ---------------- HANDLE UPLOAD ----------------
  const handleUpload =
    async () => {
      if (loading) return;

      if (!user?.uid) {
        alert(
          "Please login first"
        );

        return;
      }

      if (!title.trim()) {
        alert(
          "Please enter note title"
        );

        return;
      }

      const validationError =
        validateFile(file);

      if (validationError) {
        alert(validationError);

        return;
      }

      setLoading(true);

      try {
        // ---------------- CLOUDINARY UPLOAD ----------------
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "upload_preset",
          UPLOAD_PRESET
        );

        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Cloudinary Response:",
          data
        );

        if (
          !data.secure_url
        ) {
          throw new Error(
            data?.error
              ?.message ||
              "Cloudinary upload failed"
          );
        }

        // ---------------- URLS ----------------
        const viewUrl =
          data.secure_url;

        const downloadUrl =
          data.secure_url.replace(
            "/upload/",
            "/upload/fl_attachment/"
          );

        // ---------------- SAVE TO FIRESTORE ----------------
        await addDoc(
          collection(
            db,
            "notes"
          ),
          {
            title:
              title.trim(),

            viewUrl,

            downloadUrl,

            fileName:
              file.name,

            fileType:
              "pdf",

            createdAt:
              serverTimestamp(),

            formattedDate:
              new Date().toLocaleDateString(),

            uploadedByUid:
              user.uid,

            uploadedByName:
              user.displayName ||
              user.email ||
              "Unknown",
          }
        );

        alert(
          "Notes uploaded successfully!"
        );

        // ---------------- RESET ----------------
        setTitle("");

        setFile(null);

      } catch (error) {
        console.log(error);

        alert(
          error.message ||
            "Upload failed"
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Upload Notes
      </h1>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-xl">

        {/* TITLE */}
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          className="w-full mb-4 p-3 rounded bg-gray-800 outline-none"
        />

        {/* FILE */}
        <input
          type="file"
          accept=".pdf"
          onChange={
            handleFileChange
          }
          className="w-full mb-3"
        />

        {/* FILE NAME */}
        {file && (
          <p className="text-sm text-gray-400 mb-4">
            Selected File:
            {" "}
            {file.name}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={
            handleUpload
          }
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Uploading..."
            : "Upload Notes"}
        </button>

      </div>
    </div>
  );
};

export default UploadNotes;