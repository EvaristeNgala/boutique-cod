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
    },
    userInfo: {
      marginRight: 10,
      fontWeight: "500",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 15px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    menu: {
      background: "#0a1f44",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "70px",
      left: 0,
      width: "50%",
      height: "100vh",
      boxShadow: "2px 0 6px rgba(0,0,0,0.3)",
      zIndex: 999,
    },
    button: {
      background: "transparent",
      border: "1px solid #fff",
      color: "#fff",
      padding: "10px 15px",
      margin: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>☰</div>
        <img src={logo} alt="logo" style={styles.logo} onClick={() => navigate(`/boutique/${vendeurId}/produits`)} />
        <div>
          {userRole && <span style={styles.userInfo}>{visitorName}</span>}
          <Link to={`/boutique/${vendeurId}/cart`} style={styles.link}>🛒 {totalItems}</Link>
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} style={styles.menu}>
          <Link to={`/boutique/${vendeurId}`} style={styles.link}>Accueil</Link>
          <Link to={`/boutique/${vendeurId}/produits`} style={styles.link}>Boutique</Link>
          <Link to={`/boutique/${vendeurId}/apropos`} style={styles.link}>À propos</Link>
          <Link to={`/boutique/${vendeurId}/contact`} style={styles.link}>Contact</Link>
          {userRole ? (
            <>
              {userRole === "vendeur" && <Link to="/dashboard-vendeur" style={styles.link}>📊 Dashboard</Link>}
              <button onClick={() => logoutUser(navigate, vendeurId)} style={styles.button}>🚪 Déconnexion</button>
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
