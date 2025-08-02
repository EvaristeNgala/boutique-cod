// src/pages/RegisterVisitor.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, requestNotificationPermission } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function RegisterVisitor() {
  const { vendeurId } = useParams();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptNotifications, setAcceptNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  if (!vendeurId) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>❌ Aucun vendeur trouvé. Lien incorrect.</p>;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // ✅ Création compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Vérifie si déjà inscrit
      const userRef = doc(db, "visitors", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        alert("⚠️ Vous êtes déjà inscrit pour cette boutique.");
        navigate(`/boutique/${vendeurId}`);
        return;
      }

      // ✅ Demande permission notifications si activée
      let token = null;
      try {
        if (acceptNotifications && typeof requestNotificationPermission === "function") {
          token = await requestNotificationPermission();
        }
      } catch (notifError) {
        console.warn("⚠️ Erreur notifications :", notifError.message);
      }

      // ✅ Données visiteur
      const visitorData = {
        nom: nom || email.split("@")[0],
        email: user.email,
        vendeurId,
        notificationsEnabled: acceptNotifications,
        createdAt: new Date(),
      };

      if (token) visitorData.fcmToken = token;

      // ✅ Enregistre dans Firestore
      await setDoc(userRef, visitorData);

      alert(`✅ Inscription réussie ! Bienvenue ${nom || email.split("@")[0]} 🎉`);
      navigate(`/boutique/${vendeurId}`);
    } catch (error) {
      console.error("❌ Erreur d'inscription :", error.message);
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("⚠️ Cet email est déjà utilisé. Veuillez vous connecter.");
        setTimeout(() => navigate(`/boutique/${vendeurId}/login`), 2000);
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inscription dans la boutique</h2>

      {errorMsg && <p style={styles.error}>❌ {errorMsg}</p>}

      <form onSubmit={handleRegister} style={styles.form}>
        <input type="text" placeholder="Votre nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={styles.input} />
        <input type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />

        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={acceptNotifications} onChange={(e) => setAcceptNotifications(e.target.checked)} />  
          Je souhaite recevoir des notifications pour cette boutique
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "⏳ Inscription..." : "✅ S'inscrire"}
        </button>
      </form>

      <p style={styles.info}>⚡ Vous pouvez aussi continuer sans compte, mais vous ne recevrez pas d’alertes pour les nouveaux produits.</p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "50px auto", padding: "25px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center", fontFamily: "Arial, sans-serif" },
  title: { marginBottom: "20px", color: "#0a1f44", fontSize: "1.6rem" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", outline: "none" },
  checkboxLabel: { fontSize: "0.9rem", color: "#333", display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" },
  button: { padding: "12px", background: "#ff9800", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
  error: { color: "red", fontSize: "0.9rem", marginBottom: "10px" },
  info: { fontSize: "0.85rem", marginTop: "15px", color: "#666" },
};
