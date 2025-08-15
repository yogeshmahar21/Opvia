import { useState } from "react";
import { api } from "../api/client";

export default function Signup({ onAuthed }) {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [role,setRole]=useState("user"); const [err,setErr]=useState("");
  const submit=async(e)=>{e.preventDefault();
    const res = await api().post("/auth/signup", { name, email, password, role });
    if(res.token){ localStorage.setItem("token", res.token); onAuthed?.(res); } else setErr(res.message||"Signup failed");
  };
  return (<form onSubmit={submit}>
    <h2>Signup</h2>
    {err && <p style={{color:"red"}}>{err}</p>}
    <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
    <select value={role} onChange={e=>setRole(e.target.value)}>
      <option value="user">User</option>
      <option value="jobseeker">Job Seeker</option>
      <option value="recruiter">Recruiter</option>
    </select>
    <button>Create Account</button>
  </form>);
}
