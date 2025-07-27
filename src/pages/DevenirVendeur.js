import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function DevenirVendeur() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    nomBoutique: "",
    password: "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showPassword, setShowPassword] = useState(false); // ✅ État pour afficher/cacher le mot de passe
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "vendeurs", user.uid), {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        nomBoutique: formData.nomBoutique,
        createdAt: serverTimestamp(),
      });

      alert("✅ Inscription réussie !");
      setFormData({ nom: "", email: "", telephone: "", nomBoutique: "", password: "" });
      navigate("/dashboard-vendeur");
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  // ✅ Styles
  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f9f9f9",
    padding: isMobile ? "15px" : "40px",
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

  const passwordWrapper = { position: "relative", width: "90%", margin: "8px auto" };

  const toggleBtn = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.1rem",
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
        <h2>🛒 Devenir Vendeur</h2>
        <p>Remplissez ce formulaire pour proposer vos produits sur notre plateforme.</p>

        <form onSubmit={handleSubmit}>
          <input style={input} type="text" name="nom" placeholder="Nom complet" value={formData.nom} onChange={handleChange} required />
          <input style={input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input style={input} type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} required />
          <input style={input} type="text" name="nomBoutique" placeholder="KinMarché" value={formData.nomBoutique} onChange={handleChange} required />

          {/* ✅ Champ mot de passe avec toggle 👁️ */}
          <div style={passwordWrapper}>
            <input
              style={{ ...input, width: "100%", margin: 0 }}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" style={toggleBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" style={btn}>📩 Envoyer ma demande</button>
        </form>

        <button onClick={() => navigate("/login")} style={secondaryBtn}>
          🔑 Se connecter
        </button>
      </div>
    </div>
  );
}
