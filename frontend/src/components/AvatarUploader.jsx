// src/components/AvatarUploader.jsx
import React, { useRef } from "react";

export default function AvatarUploader({ onFileSelected, previewUrl }) {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div>
      {previewUrl && <img src={previewUrl} alt="avatar" width={96} height={96} />}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
