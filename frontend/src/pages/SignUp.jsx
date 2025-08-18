export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/register", { name, email, password });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "Registration failed. Please check your connection.";
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        <form onSubmit={submit}>
          <Input 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit">Create account</Button>
        </form>
        <Link to="/login">Already have an account? Log in</Link>
      </div>
    </div>
  );
}
