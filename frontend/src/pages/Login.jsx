import { useState } from "react";
import { api } from "../api/client";

export default function Login({ onAuthed }) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState("");
  const submit=async(e)=>{e.preventDefault();
    const res = await api().post("/auth/login", { email, password });
    if(res.token){ localStorage.setItem("token", res.token); onAuthed?.(res); } else setErr(res.message||"Login failed");
  };
  return (<form onSubmit={submit}>
    <h2>Login</h2>
    {err && <p style={{color:"red"}}>{err}</p>}
    <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
    <button>Login</button>
    <a href="/auth/google">Login with Google</a>
  </form>);
}
