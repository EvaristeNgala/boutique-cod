// src/components/NavbarVendeur.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function NavbarVendeur() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateBadge, setAnimateBadge] = useState(false);
  const [user, setUser] = useState(null);
  const [visitorName, setVisitorName] = useState("");

  const menuRef = useRef(null);

  const vendeurId = location.pathname.split("/")[2];
  const vendeurValid = vendeurId && vendeurId.trim() !== "";

  const vendeurCart = cart[vendeurId] || [];
  const totalItems = vendeurCart.reduce((sum, item) => sum + (item.quantite || 1), 0);

  useEffect(() => {
    if (totalItems > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // ✅ Récupération utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "visitors", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setVisitorName(snap.data().nom || currentUser.email);
        } else {
          setVisitorName(currentUser.email);
        }
      } else {
        setUser(null);
        setVisitorName("");
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fermer menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Déconnecté.");
    navigate(`/boutique/${vendeurId}`);
  };

  const lancerRecherche = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/boutique/${vendeurId}/search?q=${searchTerm}`);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") lancerRecherche();
  };

  const isHomeVendeur = /^\/boutique\/[^/]+$/.test(location.pathname);

  return (
    <nav style={styles.navStyle}>
      <div style={styles.topBar}>
        {/* ☰ Menu à gauche */}
        <div onClick={() => setMenuOpen(!menuOpen)} style={styles.menuIcon}>☰</div>

        {/* ✅ Logo collé à gauche */}
        <img src={logo} alt="Logo" style={styles.logoStyle} onClick={() => navigate(`/boutique/${vendeurId}`)} />

        {/* ✅ Section à droite */}
        <div style={styles.rightSection}>

          {/* ✅ Affichage nom + logout si connecté */}
          {user && (
            <div style={styles.userInfo}>
              <span style={styles.userName}>{visitorName} </span> 👤 
            </div>
          )}

          {vendeurValid && (
            <Link to={`/boutique/${vendeurId}/cart`} style={styles.cartIcon}>
              🛒 {totalItems > 0 && <span style={{ ...styles.badgeStyle, transform: animateBadge ? "scale(1.3)" : "scale(1)" }}>{totalItems}</span>}
            </Link>
          )}

          
        </div>
      </div>

      {/* ✅ Barre de recherche affichée seulement sur page boutique */}
      {isHomeVendeur && (
        <div style={styles.searchBar}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Recherche sur Grand Marché"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              style={styles.searchInput}
            />
            <button onClick={lancerRecherche} style={styles.searchButton}>🔍</button>
          </div>
        </div>
      )}

      {/* ✅ Menu latéral */}
      {vendeurValid && (
        <div ref={menuRef} style={{ ...styles.menuStyle, display: menuOpen ? "block" : "none" }}>
          {user ? (
            <>
              <button onClick={handleLogout} style={{ ...styles.menuItem, background: "transparent", border: "none", cursor: "pointer" }}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to={`/boutique/${vendeurId}/register`} style={styles.menuItem}>S'inscrire</Link>
              <Link to={`/boutique/${vendeurId}/login`} style={styles.menuItem}>Se connecter</Link>
            </>
          )}
          <Link to={`/boutique/${vendeurId}`} style={styles.menuItem}>Produits</Link>
        </div>
      )}
    </nav>
  );
}

// ✅ Styles
const styles = {
  navStyle: {
    background: "#0a1f44",
    color: "white",
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    zIndex: 5000,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  menuIcon: { fontSize: "2rem", cursor: "pointer", marginRight: "10px" },
  logoStyle: { height: "45px", cursor: "pointer", marginRight:"200px" },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  cartIcon: { color: "#fff", fontSize: "1.7rem", position: "relative", cursor: "pointer" },
  badgeStyle: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    transition: "transform 0.3s ease",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "5px 10px",
    borderRadius: "20px",
  },
  userName: { fontSize: "1.5rem" },
  logoutBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#fff",
  },
  searchBar: { marginTop: "10px", display: "flex", justifyContent: "center" },
  searchContainer: {
    width: "100%",
    maxWidth: "700px",
    display: "flex",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
  searchInput: { flex: 1, padding: "8px 12px", border: "none", fontSize: "1rem", outline: "none" },
  searchButton: { background: "#f3bb03ff", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", fontSize: "1.2rem" },
  menuStyle: { position: "absolute", top: "60px", left: 0, width: "70%", background: "#0a1f44", padding: "10px 0", boxShadow: "2px 0 6px rgba(0,0,0,0.3)" },
  menuItem: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", color: "#fff", textDecoration: "none", fontSize: "1rem" },
};
