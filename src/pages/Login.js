// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ✅ Détection mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Gestion input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Connexion Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      alert("✅ Connexion réussie !");
      navigate("/dashboard-vendeur"); // 🔥 Redirection après login
    } catch (error) {
      alert("❌ Erreur de connexion : " + error.message);
    }
  };

  // ✅ Styles
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f9f9f9",
    padding: "20px",
  };
  const box = {
    background: "#fff",
    padding: isMobile ? "20px" : "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };
  const input = {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };
  const btn = {
    width: "100%",
    padding: "12px",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.3s",
  };
  const toggleBtn = {
    position: "absolute",
    right: "30px",
    top: "37%",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#007bff",
  };
  const passwordWrapper = { position: "relative", width: "90%", margin: "auto" };
  const linkStyle = { display: "block", marginTop: "15px", color: "#007bff", textDecoration: "none" };

  return (
    <div style={container}>
      <div style={box}>
        <h2>🔐 Connexion</h2>
        <p>Connectez-vous pour accéder à votre espace vendeur.</p>

        <form onSubmit={handleSubmit}>
          <input style={input} type="email" name="email" placeholder="Email" required onChange={handleChange} />

          {/* ✅ Champ mot de passe avec affichage/masquage */}
          <div style={passwordWrapper}>
            <input
              style={{ ...input, width: "100%" }}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              required
              onChange={handleChange}
            />
            <span style={toggleBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" style={btn}>Se connecter</button>
        </form>

        {/* ✅ Liens vers inscriptions */}
        <Link to="/devenir-vendeur" style={linkStyle}>🛒 Devenir vendeur</Link>
        <Link to="/devenir-affilie" style={linkStyle}>🤝 Devenir affilié</Link>
      </div>
    </div>
  );
}
