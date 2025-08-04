// ✅ src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "../utils/logout";
import NavbarVendeur from "../components/NavbarVendeur"; // ✅ utilise ton navbar vendeur existant

export default function Login() {
  const { vendeurId } = useParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState(""); // ✅ rôle détecté
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const navigate = useNavigate();

  // ✅ Détection si déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Vérifier si c’est un vendeur
        const vendeurSnap = await getDoc(doc(db, "vendeurs", user.uid));
        if (vendeurSnap.exists()) {
          setUserRole("vendeur");
          return;
        }
        // Vérifier si c’est un visiteur
        const visitorSnap = await getDoc(doc(db, "visitors", user.uid));
        if (visitorSnap.exists()) {
          setUserRole("visiteur");
          return;
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      const vendeurRef = doc(db, "vendeurs", user.uid);
      const vendeurSnap = await getDoc(vendeurRef);

      if (vendeurSnap.exists()) {
        setUserRole("vendeur");
        navigate("/dashboard-vendeur");
        return;
      }

      const visitorRef = doc(db, "visitors", user.uid);
      const visitorSnap = await getDoc(visitorRef);

      if (visitorSnap.exists()) {
        const data = visitorSnap.data();
        if (!vendeurId || data.vendeurId !== vendeurId) {
          setErrorMsg("❌ Ce compte visiteur n’est pas autorisé pour cette boutique.");
          await logoutUser(navigate);
          return;
        }
        setUserRole("visiteur");
        navigate(`/boutique/${data.vendeurId}`);
        return;
      }

      setErrorMsg("❌ Compte introuvable ou rôle non défini.");
      await logoutUser(navigate);
    } catch (err) {
      setErrorMsg("❌ Erreur : " + err.message);
    }
  };

  const s = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#f4f6f8" },
    box: { background: "#fff", padding: isMobile ? 20 : 30, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400, textAlign: "center" },
    input: { width: "90%", padding: 12, margin: "10px 0", border: "1px solid #ccc", borderRadius: 8 },
    btn: { width: "100%", padding: 12, background: "#0a1f44", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
    error: { color: "red", fontWeight: "bold", marginTop: 10 }
  };

  return (
    <div>
      {/* ✅ Si c’est un vendeur connecté, on affiche directement son Navbar */}
      {userRole === "vendeur" && <NavbarVendeur />}

      {/* ✅ Si l’utilisateur est déjà vendeur, pas besoin de formulaire */}
      {userRole === "vendeur" ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>✅ Vous êtes déjà connecté en tant que vendeur</h2>
          <button style={s.btn} onClick={() => navigate("/dashboard-vendeur")}>
            Aller au Dashboard
          </button>
        </div>
      ) : (
        // ✅ Sinon, afficher le formulaire de login
        <div style={s.container}>
          <div style={s.box}>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
              <input style={s.input} type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <input style={s.input} type={showPassword ? "text" : "password"} name="password" placeholder="Mot de passe" onChange={handleChange} required />
              <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>{showPassword ? "🙈" : "👁️"}</span>
              <button style={s.btn} type="submit">Se connecter</button>
            </form>
            {errorMsg && <p style={s.error}>{errorMsg}</p>}
            {vendeurId ? (
              <Link to={`/boutique/${vendeurId}/register`}>Créer un compte visiteur</Link>
            ) : (
              <Link to="/devenir-vendeur">Créer un compte vendeur</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
