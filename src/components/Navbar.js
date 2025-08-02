import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Détection si on est sur une boutique vendeur
  const isBoutiqueVendeur = location.pathname.startsWith("/boutique/");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  // ✅ Styles
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: "#0a1f44",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 4000,
  };
  const logoStyle = { height: "40px", cursor: "pointer" };
  const rightSide = { display: "flex", alignItems: "center", gap: "15px" };
  const connectBtn = { color: "#fff", textDecoration: "none", background: "#007bff", padding: "6px 10px", borderRadius: "5px", fontSize: "0.9rem" };
  const cartIcon = { color: "#fff", fontSize: "1.5rem", position: "relative", cursor: "pointer" };
  const badgeStyle = { position: "absolute", top: "-5px", right: "-8px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem" };

  return (
    <nav style={navStyle}>
      {/* ✅ Logo */}
      <img src={logo} alt="Logo" style={logoStyle} onClick={() => navigate("/")} />

      <div style={rightSide}>
        {/* ✅ Se connecter / Déconnexion */}
        {!user ? (
          <Link to="/login" style={connectBtn}>Se connecter</Link>
        ) : (
          <span onClick={handleLogout} style={{ ...connectBtn, background: "red", cursor: "pointer" }}>Déconnexion</span>
        )}

        {/* ✅ Panier */}
        <Link to="/cart" style={cartIcon}>
          🛒 {cart.length > 0 && <span style={badgeStyle}>{cart.length}</span>}
        </Link>
      </div>

      {/* ✅ Si on n’est PAS sur une boutique vendeur, afficher menu complet */}
      {!isBoutiqueVendeur && (
        <div style={{ position: "absolute", left: "500px", display: "flex", gap: "20px" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
          <Link to="/shop" style={{ color: "#fff", textDecoration: "none" }}>Produits</Link>
          {!user && <Link to="/devenir-vendeur" style={{ color: "#fff", textDecoration: "none" }}>Devenir Vendeur</Link>}
          {!user && <Link to="/devenir-affilie" style={{ color: "#fff", textDecoration: "none" }}>Devenir Affilié</Link>}
          {user && <Link to="/dashboard-vendeur" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>}
        </div>
      )}
    </nav>
  );
}
