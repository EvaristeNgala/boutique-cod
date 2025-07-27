// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // ✅ Vérification de l'authentification
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Déconnexion
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  // ✅ Détection écran mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      if (window.innerWidth >= 600) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Animation badge panier
  useEffect(() => {
    if (cart.length > 0) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 400);
    }
  }, [cart.length]);

  // ✅ Styles
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#222",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 4000,
  };

  const titleStyle = { fontSize: "1.4rem", fontWeight: "bold" };

  const ulStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    position: isMobile ? "fixed" : "static",
    top: 0,
    right: 0,
    background: isMobile ? "#333" : "transparent",
    width: isMobile ? "250px" : "auto",
    height: isMobile ? "100vh" : "auto",
    padding: isMobile ? "80px 20px" : "0",
    boxShadow: isMobile ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
    gap: isMobile ? "20px" : "15px",
    listStyle: "none",
    margin: 0,
    transform: isMobile ? (menuOpen ? "translateX(0)" : "translateX(100%)") : "none",
    transition: "transform 0.3s ease-in-out",
    zIndex: 3000, // ✅ Menu au-dessus de l’overlay
  };

  const baseLinkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    padding: isMobile ? "8px 0" : "8px 12px",
    borderRadius: "5px",
    display: "block",
    width: isMobile ? "100%" : "auto",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const activeLinkStyle = {
    ...baseLinkStyle,
    color: "#ff9800",
    fontWeight: "bold",
    backgroundColor: isMobile ? "rgba(255,152,0,0.15)" : "transparent",
  };

  const badgeStyle = {
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "0.8rem",
    padding: "3px 7px",
    marginLeft: "5px",
    fontWeight: "bold",
    display: "inline-block",
    minWidth: "20px",
    textAlign: "center",
    transform: animateBadge ? "scale(1.3)" : "scale(1)",
    transition: "transform 0.3s ease",
  };

  const menuIcon = {
    fontSize: "1.8rem",
    cursor: "pointer",
    display: isMobile ? "block" : "none",
    zIndex: 4001,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    opacity: menuOpen ? 1 : 0,
    visibility: menuOpen ? "visible" : "hidden",
    pointerEvents: menuOpen ? "auto" : "none",
    transition: "opacity 0.3s ease",
    zIndex: 2000, // ✅ en dessous du menu
  };

  const handleLinkClick = () => setTimeout(() => setMenuOpen(false), 200);

  const getLinkStyle = (path) =>
    location.pathname === path ? activeLinkStyle : baseLinkStyle;

  return (
    <>
      <nav style={navStyle}>
        <h1 style={titleStyle}>Boutique COD</h1>

        {isMobile && (
          <span style={menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </span>
        )}

        <ul style={ulStyle} onClick={(e) => e.stopPropagation()}>
          <li>
            <Link to="/" style={getLinkStyle("/")} onClick={handleLinkClick}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/shop" style={getLinkStyle("/shop")} onClick={handleLinkClick}>
              Produits
            </Link>
          </li>

          {!user && (
            <>
              <li>
                <Link to="/devenir-vendeur" style={getLinkStyle("/devenir-vendeur")} onClick={handleLinkClick}>
                  Devenir Vendeur
                </Link>
              </li>
              <li>
                <Link to="/devenir-affilie" style={getLinkStyle("/devenir-affilie")} onClick={handleLinkClick}>
                  Devenir Affilié
                </Link>
              </li>
              <li>
                <Link to="/login" style={getLinkStyle("/login")} onClick={handleLinkClick}>
                  Se Connecter
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link to="/dashboard-vendeur" style={getLinkStyle("/dashboard-vendeur")} onClick={handleLinkClick}>
                  Dashboard
                </Link>
              </li>
              <li>
                <span style={{ ...baseLinkStyle, color: "red" }} onClick={handleLogout}>
                  🚪 Déconnexion
                </span>
              </li>
            </>
          )}

          {/* ✅ Panier affiché uniquement si utilisateur NON connecté */}
          {!user && (
            <li>
              <Link to="/cart" style={getLinkStyle("/cart")} onClick={handleLinkClick}>
                🛒 Panier {cart.length > 0 && <span style={badgeStyle}>{cart.length}</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {isMobile && <div style={overlayStyle} onClick={() => setMenuOpen(false)} />}
    </>
  );
}
