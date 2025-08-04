import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { logoutUser } from "../utils/logout";

export default function RegisterVisitor() {
  const { vendeurId } = useParams();
  const [form, setForm] = useState({ nom: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const vendeurSnap = await getDoc(doc(db, "vendeurs", user.uid));
        if (vendeurSnap.exists()) {
          setErrorMsg("❌ Vous êtes connecté comme vendeur. Déconnectez-vous pour créer un compte visiteur.");
          await logoutUser(navigate);
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "visitors", u.user.uid), {
        nom: form.nom,
        email: form.email,
        role: "visiteur",
        vendeurId,
        createdAt: new Date().toISOString(),
      });
      navigate(`/boutique/${vendeurId}`);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ✅ Styles en objet
  const s = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f8",
      padding: 20,
    },
    card: {
      background: "#fff",
      padding: "30px 25px",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: 400,
      textAlign: "center",
    },
    title: {
      marginBottom: 20,
      color: "#0a1f44",
    },
    input: {
      width: "100%",
      padding: "12px 10px",
      marginBottom: 15,
      border: "1px solid #ccc",
      borderRadius: 8,
      fontSize: "1rem",
      outline: "none",
      transition: "0.2s",
    },
    btn: {
      width: "100%",
      padding: "12px",
      background: "#0a1f44",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },
    btnHover: {
      background: "#09203a",
    },
    error: {
      color: "red",
      fontWeight: "bold",
      marginBottom: 10,
    },
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h2 style={s.title}>Créer un compte visiteur</h2>
        {errorMsg && <p style={s.error}>{errorMsg}</p>}
        {!errorMsg && (
          <form onSubmit={handleSubmit}>
            <input style={s.input} name="nom" placeholder="Nom" required onChange={handleChange} />
            <input style={s.input} type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <input style={s.input} type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} />
            <button
              type="submit"
              style={s.btn}
              onMouseOver={(e) => (e.target.style.background = "#09203a")}
              onMouseOut={(e) => (e.target.style.background = "#0a1f44")}
            >
              ✅ S'inscrire
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
