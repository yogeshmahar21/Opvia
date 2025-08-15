import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Profile({ userId }) {
  const [profile,setProfile]=useState(null);
  useEffect(()=>{ api().get(`/api/users/${userId}`).then(setProfile); },[userId]);
  if(!profile) return <p>Loading...</p>;
  return (<div>
    <img alt="" src={profile.profilePic} width={80}/>
    <h2>{profile.Username}</h2>
    <p>{profile.about}</p>
    <p>Skills: {profile.skills?.join(", ")}</p>
  </div>);
}
