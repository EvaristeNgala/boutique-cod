// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.png"; // ✅ Logo PNG

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Styles principaux
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#0d1b2a", // ✅ Bleu sombre
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 4000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  };

  const leftSide = { display: "flex", alignItems: "center", gap: "10px" };
  const logoStyle = { height: "40px", cursor: "pointer" };

  const centerLinks = {
    display: isMobile ? "none" : "flex",
    gap: "25px",
    marginLeft: "30px",
    flex: 1,
  };

  const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "1rem", fontWeight: "500" };

  const rightSide = { display: "flex", alignItems: "center", gap: "12px" };
  const connectBtn = {
    color: "#fff",
    textDecoration: "none",
    background: "#1b263b",
    padding: "7px 12px",
    borderRadius: "5px",
    fontSize: "0.9rem",
    border: "1px solid #415a77",
  };
  const cartIcon = { color: "#fff", fontSize: "1.4rem", position: "relative" };
  const badgeStyle = {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.7rem",
  };

  const menuIcon = { fontSize: "1.9rem", cursor: "pointer", display: isMobile ? "block" : "none" };

  // ✅ Menu latéral mobile
  const sideMenu = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "250px",
    height: "100%",
    background: "#1b263b", // ✅ Bleu sombre menu
    color: "#fff",
    padding: "70px 20px",
    transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
    zIndex: 3000,
  };

  const sideMenuLink = { display: "block", color: "#fff", textDecoration: "none", padding: "12px 0", fontSize: "1.1rem", borderBottom: "1px solid #415a77" };

  const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    opacity: menuOpen ? 1 : 0,
    visibility: menuOpen ? "visible" : "hidden",
    transition: "opacity 0.3s ease",
    zIndex: 2000,
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav style={navStyle}>
        {/* ✅ Hamburger + Logo */}
        <div style={leftSide}>
          {isMobile && <span style={menuIcon} onClick={() => setMenuOpen(true)}>☰</span>}
          <img src={logo} alt="Logo" style={logoStyle} onClick={() => navigate("/")} />
        </div>

        {/* ✅ Liens (PC uniquement) */}
        <div style={centerLinks}>
          <Link to="/" style={linkStyle}>Accueil</Link>
          <Link to="/shop" style={linkStyle}>Boutique</Link>
          {!user && <Link to="/devenir-vendeur" style={linkStyle}>Devenir Vendeur</Link>}
          {!user && <Link to="/devenir-affilie" style={linkStyle}>Devenir Affilié</Link>}
          {user && <Link to="/dashboard-vendeur" style={linkStyle}>Dashboard</Link>}
        </div>

        {/* ✅ Droite */}
        <div style={rightSide}>
          {!user ? (
            <Link to="/login" style={connectBtn}>Se connecter</Link>
          ) : (
            <span onClick={handleLogout} style={{ ...connectBtn, background: "red", cursor: "pointer" }}>Déconnexion</span>
          )}
          {!user && (
            <Link to="/cart" style={cartIcon}>
              🛒 {cart.length > 0 && <span style={badgeStyle}>{cart.length}</span>}
            </Link>
          )}
        </div>
      </nav>

      {/* ✅ Overlay quand menu mobile est ouvert */}
      {isMobile && <div style={overlay} onClick={() => setMenuOpen(false)} />}

      {/* ✅ Menu latéral mobile */}
      {isMobile && (
        <div style={sideMenu}>
          <Link to="/" style={sideMenuLink} onClick={() => setMenuOpen(false)}>🏠 Accueil</Link>
          <Link to="/shop" style={sideMenuLink} onClick={() => setMenuOpen(false)}>🛍 Boutique</Link>
          {!user && <Link to="/devenir-vendeur" style={sideMenuLink} onClick={() => setMenuOpen(false)}>📦 Devenir Vendeur</Link>}
          {!user && <Link to="/devenir-affilie" style={sideMenuLink} onClick={() => setMenuOpen(false)}>🤝 Devenir Affilié</Link>}
          {user && <Link to="/dashboard-vendeur" style={sideMenuLink} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>}
        </div>
      )}
    </>
  );
}
