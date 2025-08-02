// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const { vendeurId } = useParams();
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
      if (vendeurId) {
        navigate(`/boutique/${vendeurId}`);
      } else {
        navigate("/dashboard-vendeur");
      }
    } catch (error) {
      alert("❌ Erreur de connexion : " + error.message);
    }
  };

  // ✅ Styles améliorés
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f4f6f8",
    padding: "20px",
  };
  const box = {
    background: "#fff",
    padding: isMobile ? "20px" : "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };
  const input = {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.3s ease",
  };
  const passwordWrapper = {
    position: "relative",
    margin: "10px 0",
    width: "100%",
  };
  const toggleBtn = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.1rem",
    color: "#007bff",
  };
  const btn = {
    width: "100%",
    padding: "12px",
    background: "#0a1f44",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.05rem",
    transition: "background 0.3s",
  };
  const btnHover = { background: "#092039" };
  const linkStyle = {
    display: "block",
    marginTop: "15px",
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.95rem",
  };

  return (
    <div style={container}>
      <div style={box}>
        <h2 style={{ color: "#0a1f44", marginBottom: "10px" }}> Connexion</h2>
        <p style={{ fontSize: "0.95rem", color: "#555" }}>
          {vendeurId
            ? "Connectez-vous pour accéder à votre compte visiteur dans cette boutique."
            : "Connectez-vous pour accéder à votre espace vendeur."}
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
          <input
            style={input}
            type="email"
            name="email"
            placeholder="Votre email"
            required
            onChange={handleChange}
          />

          {/* ✅ Champ mot de passe aligné */}
          <div style={passwordWrapper}>
            <input
              style={input}
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

          <button
            type="submit"
            style={btn}
            onMouseOver={(e) => (e.target.style.background = btnHover.background)}
            onMouseOut={(e) => (e.target.style.background = "#0a1f44")}
          >
            Se connecter
          </button>
        </form>

        {/* ✅ Liens adaptés */}
        {vendeurId ? (
          <Link to={`/boutique/${vendeurId}/register`} style={linkStyle}>
            Créer un compte visiteur
          </Link>
        ) : (
          <>
            <Link to="/devenir-vendeur" style={linkStyle}>🛒 Devenir vendeur</Link>
            <Link to="/devenir-affilie" style={linkStyle}>🤝 Devenir affilié</Link>
          </>
        )}
      </div>
    </div>
  );
}
