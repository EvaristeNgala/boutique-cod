// src/components/ProductModal.jsx
import React, { useEffect } from "react";

export default function ProductModal({ product, onClose }) {
  const { name, price, description, image } = product;

  // ✅ Lien WhatsApp direct
  const sendWhatsApp = () => {
    const vendeurWhatsApp = "243823676439"; // ⚠️ Remplace par ton numéro
    const message = `📦 *Commande directe*%0A
👕 Produit: ${name}%0A
💰 Prix: ${price}$%0A
✅ Paiement à la livraison`;
    window.open(`https://wa.me/${vendeurWhatsApp}?text=${message}`, "_blank");
  };

  // ✅ Ajout animation fade
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @keyframes popupAnim { from {opacity:0;transform:scale(0.9);} to {opacity:1;transform:scale(1);} }
    `;
    document.head.appendChild(styleTag);
  }, []);

  const overlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 };
  const modal = { background: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "400px", animation: "popupAnim 0.3s ease", position: "relative", textAlign: "center" };
  const closeBtn = { position: "absolute", top: "10px", right: "10px", background: "red", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" };
  const imgStyle = { width: "100%", borderRadius: "8px", marginBottom: "10px" };
  const btnWhatsApp = { background: "#25D366", color: "#fff", border: "none", padding: "12px", width: "100%", fontSize: "1rem", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✖</button>
        <img src={image} alt={name} style={imgStyle} />
        <h2>{name}</h2>
        <p style={{ color: "#ff9800", fontWeight: "bold" }}>{price} $</p>
        <p>{description || "Produit de haute qualité."}</p>
        <button style={btnWhatsApp} onClick={sendWhatsApp}>📲 Commander via WhatsApp</button>
      </div>
    </div>
  );
}
