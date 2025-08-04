import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "../utils/logout";

export default function NavbarVendeur() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [visitorName, setVisitorName] = useState("");
  const menuRef = useRef(null);
  const vendeurId = location.pathname.split("/")[2];
  const vendeurCart = cart[vendeurId] || [];
  const totalItems = vendeurCart.reduce((sum, i) => sum + (i.quantite || 1), 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const vendeurSnap = await getDoc(doc(db, "vendeurs", u.uid));
        if (vendeurSnap.exists()) {
          setUserRole("vendeur");
          setVisitorName(vendeurSnap.data().nom || u.email);
          if (vendeurId) navigate("/dashboard-vendeur");
          return;
        }
        const visitorSnap = await getDoc(doc(db, "visitors", u.uid));
        if (visitorSnap.exists()) {
          setUserRole("visiteur");
          setVisitorName(visitorSnap.data().nom || u.email);
          if (visitorSnap.data().vendeurId !== vendeurId)
            navigate(`/boutique/${visitorSnap.data().vendeurId}`);
          return;
        }
        await logoutUser(navigate);
      } else {
        setUserRole(null);
        setVisitorName("");
      }
    });
    return () => unsubscribe();
  }, [navigate, vendeurId]);

  useEffect(() => {
    const clickOutside = (e) =>
      menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const styles = {
    nav: {
      background: "#0a1f44",
      color: "#fff",
      padding: "12px 20px",
      boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      height: 45,
      cursor: "pointer",
      borderRadius: "5px",
    },
    hamburger: {
      fontSize: "2rem",
      cursor: "pointer",
      userSelect: "none",
      transition: "0.3s",
    },
    userInfo: {
      marginRight: 10,
      fontWeight: "500",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
      padding: "6px 10px",
      borderRadius: "5px",
      transition: "0.3s",
    },
    menu: {
      background: "#0a1f44",
      padding: 10,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      borderTop: "1px solid rgba(255,255,255,0.3)",
    },
    button: {
      background: "transparent",
      border: "1px solid #fff",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonHover: {
      backgroundColor: "#fff",
      color: "#0a1f44",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>☰</div>
        <img src={logo} alt="logo" style={styles.logo} onClick={() => navigate(`/boutique/${vendeurId}`)} />
        <div>
          {userRole && <span style={styles.userInfo}>{visitorName} </span>}
          <Link to={`/boutique/${vendeurId}/cart`} style={styles.link}>🛒 {totalItems}</Link>
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} style={styles.menu}>
          {/* ✅ Liens visibles pour tous */}
          <Link to={`/boutique/${vendeurId}`} style={styles.link}>Accueil</Link>
          <Link to={`/boutique/${vendeurId}/produits`} style={styles.link}>Produits</Link>
          <Link to={`/boutique/${vendeurId}/apropos`} style={styles.link}>À propos</Link>
          <Link to={`/boutique/${vendeurId}/contact`} style={styles.link}>Contact</Link>

          {userRole ? (
            <>
              {/* ✅ Lien Dashboard uniquement pour vendeur */}
              {userRole === "vendeur" && (
                <Link to="/dashboard-vendeur" style={styles.link}>Dashboard</Link>
              )}

              <button
                onClick={() => logoutUser(navigate, vendeurId)}
                style={styles.button}
                onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, styles.button)}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to={`/boutique/${vendeurId}/register`} style={styles.link}>Inscription</Link>
              <Link to={`/boutique/${vendeurId}/login`} style={styles.link}>Connexion</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
