// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../App";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refresh } = useContext(AuthContext);

  const submit = async () => {
    try {
      const { data } = await api.post("/api/login", { email, password });
      localStorage.setItem("token", data.token);
      await refresh();
      navigate("/feed");
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={submit}>Login</Button>
      <div>
        <a href="http://localhost:5000/auth/google">Login with Google</a>
      </div>
    </div>
  );
}
