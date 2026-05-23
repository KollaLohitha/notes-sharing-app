export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "notes_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dcevzpbed/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  return await response.json();
};