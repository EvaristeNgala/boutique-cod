// ✅ src/pages/DevenirVendeur.jsx (sans pourcentageAffiliation)
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function DevenirVendeur() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    nomBoutique: "",
    telephone: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const visitorRef = doc(db, "visitors", user.uid);
        const visitorSnap = await getDoc(visitorRef);
        if (visitorSnap.exists()) {
          setErrorMsg("❌ Vous êtes actuellement connecté comme visiteur. Déconnectez-vous avant de créer un compte vendeur.");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorMsg) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, "vendeurs", user.uid), {
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        nomBoutique: form.nomBoutique,
        role: "vendeur",
        createdAt: new Date().toISOString(),
      });

      alert("✅ Compte vendeur créé avec succès !");
      navigate("/dashboard-vendeur");
    } catch (error) {
      alert("❌ Erreur : " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🛒 Créer un compte vendeur</h2>
      {errorMsg && <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>}

      {!errorMsg && (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
          <input name="nom" placeholder="Votre nom complet" required onChange={handleChange} style={styles.input} />
          <input name="nomBoutique" placeholder="Nom de la boutique" required onChange={handleChange} style={styles.input} />
          <input name="telephone" placeholder="Téléphone" required onChange={handleChange} style={styles.input} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.btn}>✅ Créer mon compte vendeur</button>
        </form>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#0a1f44",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
