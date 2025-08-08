// src/pages/Cart.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import OrderModal from "../components/OrderModal";

export default function Cart() {
  const { vendeurId } = useParams();
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const vendeurCart = cart[vendeurId] || [];

  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = vendeurCart.reduce(
    (sum, item) => sum + item.price * (item.quantite || 1),
    0
  );

  const styles = {
    container: {
      padding: isMobile ? "10px" : "40px",
      background: "linear-gradient(135deg, #f5f7fa, #e8edf3)",
      minHeight: "90vh",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "800px",
      background: "#fff",
      borderRadius: "15px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      padding: isMobile ? "15px" : "30px",
      animation: "fadeIn 0.3s ease-in-out",
    },
    title: {
      textAlign: "center",
      fontSize: isMobile ? "1.5rem" : "2rem",
      color: "#222",
      fontWeight: "700",
      marginBottom: "20px",
    },
    empty: {
      textAlign: "center",
      color: "#777",
      fontSize: "1.1rem",
      fontStyle: "italic",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "10px",
      background: "#fafafa",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease",
    },
    img: {
      width: "70px",
      height: "70px",
      objectFit: "cover",
      borderRadius: "10px",
      marginRight: "15px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    info: { display: "flex", alignItems: "center", flex: 1 },
    productName: { fontWeight: "600", fontSize: "1.05rem", color: "#333" },
    colorDetail: { fontSize: "0.9rem", color: "#666", marginTop: "4px" },
    quantityInput: {
      width: "60px",
      textAlign: "center",
      borderRadius: "5px",
      border: "1px solid #ccc",
      padding: "4px",
      marginRight: "10px",
      fontSize: "1rem",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
    },
    price: { fontWeight: "700", color: "#ff9800", fontSize: "1.1rem", marginRight: "10px" },
    btnRemove: {
      background: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background 0.3s",
    },
    total: {
      textAlign: "right",
      fontSize: "1.4rem",
      marginTop: "15px",
      fontWeight: "700",
      color: "#222",
      borderTop: "1px solid #ddd",
      paddingTop: "10px",
    },
    btnPrimary: {
      width: "100%",
      background: "linear-gradient(45deg, #ff9800, #ff7300)",
      color: "white",
      border: "none",
      padding: "14px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1.1rem",
      marginTop: "20px",
      transition: "transform 0.2s ease, background 0.3s ease",
    },
    btnSecondary: {
      width: "100%",
      background: "#555",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "10px",
      transition: "background 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛒 Votre Panier</h2>

        {vendeurCart.length === 0 ? (
          <p style={styles.empty}>
            Votre panier est vide.{" "}
            <a href={`/boutique/${vendeurId}/produits`}>Voir les produits</a>
          </p>
        ) : (
          <>
            <ul style={styles.list}>
              {vendeurCart.map((item, index) => (
                <li key={index} style={styles.item}>
                  <div style={styles.info}>
                    <img src={item.image} alt={item.nom || item.name} style={styles.img} />
                    <div>
                      <span style={styles.productName}>
                        {item.nom || item.name}{" "}
                        <span style={{ fontWeight: "normal", fontSize: "0.9rem", marginLeft: "10px" }}>
                          Taille : <strong>{item.taille || "N/A"}</strong>
                        </span>
                      </span>
                      <div style={styles.colorDetail}>
                        Couleur : <strong>{item.couleur || "N/A"}</strong>
                      </div>
                    </div>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={item.quantite || 1}
                    onChange={(e) =>
                      updateQuantity(item.id, vendeurId, parseInt(e.target.value) || 1, item.taille, item.couleur)
                    }
                    style={styles.quantityInput}
                  />

                  <span style={styles.price}>
                    {(item.price * (item.quantite || 1)).toFixed(2)} $
                  </span>

                  <button
                    style={styles.btnRemove}
                    onClick={() => removeFromCart(item.id, vendeurId, item.taille, item.couleur)}
                    onMouseOver={(e) => (e.target.style.background = "#c82333")}
                    onMouseOut={(e) => (e.target.style.background = "#dc3545")}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>

            <h3 style={styles.total}>💰 Total : {total.toFixed(2)} $</h3>

            <button
              style={styles.btnPrimary}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)") }
              onMouseOut={(e) => (e.target.style.transform = "scale(1)") }
              onClick={() => setShowModal(true)}
            >
              Passer la commande
            </button>

            <button
              style={styles.btnSecondary}
              onMouseOver={(e) => (e.target.style.background = "#333")}
              onMouseOut={(e) => (e.target.style.background = "#555")}
              onClick={() => clearCart(vendeurId)}
            >
              Vider le panier
            </button>
          </>
        )}
      </div>

      {showModal && (
        <OrderModal
          cart={vendeurCart}
          total={total}
          onClose={() => setShowModal(false)}
          clearCart={() => clearCart(vendeurId)}
          vendeurId={vendeurId} // 🔹 Ajout important
        />
      )}
    </div>
  );
}
