import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard(){
  const token = localStorage.getItem("token");
  const [stats,setStats]=useState(null);
  useEffect(()=>{ api(token).get("/api/dashboard").then(setStats); },[]);
  if(!stats) return <p>Loading...</p>;
  return (<div>
    <h2>My Dashboard</h2>
    <p>Posts: {stats.postsCount}</p>
    <p>Connections: {stats.connectionsCount}</p>
    <p>Job Applications: {stats.applicationsCount}</p>
  </div>);
}
