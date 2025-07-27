// src/pages/DevenirAffilie.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DevenirAffilie() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    audience: "",
    description: "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Votre demande d’affiliation a été envoyée !");
    setFormData({ nom: "", email: "", telephone: "", audience: "", description: "" });
  };

  // ✅ Styles identiques au design des autres pages
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
    maxWidth: "500px",
    textAlign: "center",
  };

  const input = {
    width: "90%",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  const textarea = {
    ...input,
    minHeight: "100px",
    resize: "vertical",
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
    marginTop: "10px",
  };

  const secondaryBtn = {
    width: "100%",
    padding: "10px",
    background: "#fff",
    color: "#222",
    border: "1px solid #222",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  };

  return (
    <div style={container}>
      <div style={box}>
        <h2>🤝 Devenir Affilié</h2>
        <p>Rejoignez notre programme et gagnez des commissions sur chaque vente générée.</p>

        <form onSubmit={handleSubmit}>
          <input style={input} type="text" name="nom" placeholder="Nom complet" value={formData.nom} onChange={handleChange} required />
          <input style={input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input style={input} type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} required />
          <input style={input} type="text" name="audience" placeholder="Votre audience (Instagram, TikTok, Blog...)" value={formData.audience} onChange={handleChange} required />
          <textarea style={textarea} name="description" placeholder="Présentez votre profil et comment vous allez promouvoir nos produits" value={formData.description} onChange={handleChange} required />
          <button type="submit" style={btn}>📩 Envoyer ma demande</button>
        </form>

        <button onClick={() => navigate("/login")} style={secondaryBtn}>
          🔑 Se connecter
        </button>
      </div>
    </div>
  );
}
