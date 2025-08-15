import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function EditProfile() {
  const token = localStorage.getItem("token");
  const [me,setMe]=useState({ Username:"", about:"", profilePic:"", skills:[] });

  useEffect(()=>{ /* fetch me if you have a /me endpoint, else store user in app state */ },[]);
  const save=async()=>{ await api(token).post(`/api/users/${"me"}`, me, "PUT"); alert("Saved"); };

  return (<div>
    <input value={me.Username} onChange={e=>setMe({...me, Username:e.target.value})}/>
    <input value={me.profilePic} onChange={e=>setMe({...me, profilePic:e.target.value})} placeholder="Profile image URL"/>
    <textarea value={me.about} onChange={e=>setMe({...me, about:e.target.value})}/>
    <button onClick={save}>Save</button>
  </div>);
}
