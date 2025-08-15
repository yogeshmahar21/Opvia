import { useState } from "react";
import { api } from "../api/client";

export default function Settings(){
  const token = localStorage.getItem("token");
  const [privacy,setPrivacy]=useState({ profileVisibility:"public" });
  const [notifications,setNotifications]=useState({ messages:true, jobs:true });

  const save=async()=>{ await api(token).post(`/api/users/${"me"}/settings`, { privacy, notifications }, "PUT"); alert("Saved"); };
  return (<div>
    <h2>Settings</h2>
    <label>Profile visibility</label>
    <select value={privacy.profileVisibility} onChange={e=>setPrivacy({profileVisibility:e.target.value})}>
      <option value="public">Public</option>
      <option value="connections">Connections only</option>
      <option value="private">Only me</option>
    </select>
    <div>
      <label><input type="checkbox" checked={notifications.messages} onChange={e=>setNotifications({...notifications, messages:e.target.checked})}/> Message alerts</label>
      <label><input type="checkbox" checked={notifications.jobs} onChange={e=>setNotifications({...notifications, jobs:e.target.checked})}/> Job alerts</label>
    </div>
    <button onClick={save}>Save</button>
  </div>);
}
