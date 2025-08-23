// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    skills: "",
    status: "",
    username: "",
  });

  const [profileId, setProfileId] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        let profile;
        if (res.ok) {
          profile = data.profile;
          setProfileId(profile._id);
        }
        if (!profile) throw new Error("No profile returned");

        setForm({
          name: profile.name || "",
          skills: (profile.skills || []).join(", "),
          status: profile.userStatus || "",
          username: profile.username || "",
        });

        if (profile.profilePic) {
          setPreview(profile.profilePic.startsWith("http")
            ? profile.profilePic
            : `${API_URL}/${profile.profilePic}`);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Failed to load profile. Please create one.");
        navigate("/onboarding");
      }
    })();
  }, [navigate]);

  const save = async () => {
    try {
      await Promise.all([
        api.put(`/api/user/profile/updateSkills/${profileId}`, {
          skills: form.skills,
        }),
        api.put(`/api/user/profile/update/status/${profileId}`, {
          newStatus: form.status,
        }),
      ]);

      if (profilePic) {
        const formData = new FormData();
        formData.append("ProfileImg", profilePic);

        try {
          const res = await fetch(`${API_URL}/api/user/profile/${profileId}`, {
            method: 'PUT',
            body: formData
          });

          const data = await res.json();

          if(res.ok) {
            console.log(data);
            alert('updated');
          }
        } catch (err) {
          console.log(err);
        }

        // const data = await api.put(`/api/user/profile/${profileId}`, formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        // console.log('proficPic Update',data)
      }

      alert("Changes updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message || err);
      alert("Update failed");
    }
  };

  return (
    <div className="page-container max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Edit Profile
      </h2>

      {/* Profile Picture Upload + Preview */}
      <div className="mb-8 flex flex-col items-center">
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-36 h-36 rounded-full object-cover border-2 border-gray-300 mb-4 shadow"
          />
        ) : (
          <div className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 text-gray-400">
            No Photo
          </div>
        )}
        <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              setProfilePic(file);
              setPreview(file ? URL.createObjectURL(file) : preview);
            }}
          />
        </label>
      </div>

      {/* Name (read-only) */}
      <div className="mb-6">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Skills */}
      <div className="mb-6">
        <Input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
      </div>

      {/* Status */}
      <div className="mb-6">
        <Input
          placeholder="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={save}
          className="px-6 py-2 rounded-lg font-semibold shadow-md bg-blue-600 text-white 
                     hover:bg-blue-700 transition duration-200"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
