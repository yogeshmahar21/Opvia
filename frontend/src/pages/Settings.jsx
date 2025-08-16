// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Button from "../components/Button";

export default function Settings() {
  const [settings, setSettings] = useState({
    email: "",
    privacy: "public",
    notifications: true,
  });

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/profile");
      setSettings({
        email: data.email || "",
        privacy: data.privacy || "public",
        notifications: data.notifications ?? true,
      });
    })();
  }, []);

  const save = async () => {
    await api.put("/api/users/me/settings", settings);
    alert("Settings saved");
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>Email</label>
        <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
      </div>
      <div>
        <label>Privacy</label>
        <select value={settings.privacy} onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}>
          <option value="public">Public</option>
          <option value="connections">Connections only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label>Notifications</label>
        <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} />
      </div>
      <Button onClick={save}>Save</Button>
    </div>
  );
}
