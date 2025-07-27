// src/pages/Cart.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import OrderModal from "../components/OrderModal";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // ✅ Détection de la taille de l'écran
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // ✅ Styles
  const styles = {
    container: {
      padding: isMobile ? "15px" : "40px",
      background: "#f5f7fa",
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "750px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: isMobile ? "15px" : "25px",
    },
    title: {
      textAlign: "center",
      fontSize: isMobile ? "1.4rem" : "1.8rem",
      color: "#222",
      marginBottom: "15px",
    },
    empty: {
      textAlign: "center",
      fontSize: isMobile ? "1rem" : "1.1rem",
      color: "#555",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "10px 5px" : "12px 10px",
      borderBottom: "1px solid #eee",
      flexWrap: isMobile ? "wrap" : "nowrap",
    },
    img: {
      width: isMobile ? "50px" : "60px",
      height: isMobile ? "50px" : "60px",
      objectFit: "cover",
      borderRadius: "6px",
      marginRight: "10px",
    },
    info: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
    },
    productName: {
      fontWeight: "500",
      flex: 1,
      fontSize: isMobile ? "0.9rem" : "1rem",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    price: {
      fontWeight: "bold",
      color: "#ff9800",
      marginRight: "10px",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    btnRemove: {
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: isMobile ? "5px 8px" : "6px 10px",
      cursor: "pointer",
      fontSize: isMobile ? "0.8rem" : "0.9rem",
      transition: "background 0.3s",
    },
    total: {
      textAlign: "right",
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      marginTop: "15px",
      fontWeight: "600",
      color: "#333",
    },
    btnPrimary: {
      width: "100%",
      background: "#ff9800",
      color: "white",
      border: "none",
      padding: isMobile ? "10px" : "12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: isMobile ? "1rem" : "1.05rem",
      marginTop: "20px",
      transition: "background 0.3s",
    },
    btnSecondary: {
      width: "100%",
      background: "#555",
      color: "white",
      border: "none",
      padding: isMobile ? "9px" : "10px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "10px",
      fontSize: isMobile ? "0.95rem" : "1rem",
      transition: "background 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛒 Votre Panier</h2>

        {cart.length === 0 ? (
          <p style={styles.empty}>
            Votre panier est vide. <a href="/shop">Voir les produits</a>
          </p>
        ) : (
          <>
            <ul style={styles.list}>
              {cart.map((item, index) => (
                <li key={index} style={styles.item}>
                  <div style={styles.info}>
                    <img src={item.image} alt={item.name} style={styles.img} />
                    <span style={styles.productName}>{item.name}</span>
                  </div>
                  <span style={styles.price}>{item.price} $</span>
                  <button
                    style={styles.btnRemove}
                    onMouseEnter={(e) => (e.target.style.background = "#cc0000")}
                    onMouseLeave={(e) => (e.target.style.background = "red")}
                    onClick={() => removeFromCart(index)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>

            <h3 style={styles.total}>Total : {total} $</h3>

            <button
              style={styles.btnPrimary}
              onMouseEnter={(e) => (e.target.style.background = "#e68a00")}
              onMouseLeave={(e) => (e.target.style.background = "#ff9800")}
              onClick={() => setShowModal(true)}
            >
              Commander
            </button>

            <button
              style={styles.btnSecondary}
              onMouseEnter={(e) => (e.target.style.background = "#333")}
              onMouseLeave={(e) => (e.target.style.background = "#555")}
              onClick={clearCart}
            >
              Vider le panier
            </button>
          </>
        )}
      </div>

      {showModal && (
        <OrderModal
          cart={cart}
          total={total}
          onClose={() => setShowModal(false)}
          clearCart={clearCart}
        />
      )}
    </div>
  );
}
