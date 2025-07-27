import React, { useState, useEffect } from "react";

export default function OrderModal({ cart, total, onClose, clearCart }) {
  const [form, setForm] = useState({ name: "", country: "", city: "", address: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // ✅ Construire message WhatsApp avec les infos client + produits
    const produits = cart.map((item) => `• ${item.name} - ${item.price}$`).join("%0A");
    const message = `📦 *Nouvelle Commande*%0A
👤 Nom: ${form.name}%0A
🌍 Pays: ${form.country}%0A
🏙️ Ville: ${form.city}%0A
🏠 Adresse: ${form.address}%0A
📞 Téléphone: ${form.phone}%0A
🛒 Produits:%0A${produits}%0A
💰 Total: ${total} $%0A
✅ *Paiement à la livraison*`;

    // ✅ Numéro WhatsApp du vendeur (remplace par le tien)
    const vendeurWhatsApp = "243823676439"; // ← à personnaliser

    // ✅ Lien vers WhatsApp
    const url = `https://wa.me/${vendeurWhatsApp}?text=${message}`;

    // ✅ Ouvre WhatsApp (mobile/web)
    window.open(url, "_blank");

    // ✅ Affichage succès après ouverture WhatsApp
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      clearCart();

      // Ferme modal après 2.5s
      setTimeout(() => onClose(), 2500);
    }, 1200);
  };

  // ✅ Styles dynamiques
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  };

  const modalStyle = {
    background: "#fff",
    padding: isMobile ? "15px" : "25px",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    animation: "popupAnim 0.3s ease",
    position: "relative",
    textAlign: "center",
  };

  const closeBtn = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "90%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const btnStyle = {
    background: sending ? "#999" : "#25D366", // ✅ WhatsApp vert
    color: "#fff",
    border: "none",
    padding: "12px",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: sending ? "not-allowed" : "pointer",
    transition: "background 0.3s",
  };

  const successStyle = {
    background: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    marginTop: "10px",
    animation: "fadeIn 0.5s ease",
  };

  // ✅ Ajout animations CSS
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @keyframes popupAnim {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtn} onClick={onClose}>✖</button>
        <h2>📝 Finaliser votre commande</h2>
        <p>Total à payer : <strong>{total} $</strong> (paiement à la livraison)</p>

        {success ? (
          <div style={successStyle}>✅ Commande envoyée sur WhatsApp !</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input style={inputStyle} type="text" name="name" placeholder="Nom complet" required onChange={handleChange} />
            <input style={inputStyle} type="text" name="country" placeholder="Pays" required onChange={handleChange} />
            <input style={inputStyle} type="text" name="city" placeholder="Ville" required onChange={handleChange} />
            <input style={inputStyle} type="text" name="address" placeholder="Adresse complète" required onChange={handleChange} />
            <input style={inputStyle} type="tel" name="phone" placeholder="Numéro de téléphone" required onChange={handleChange} />
            <button type="submit" style={btnStyle} disabled={sending}>
              {sending ? "⏳ Envoi vers WhatsApp..." : "📲 Envoyer via WhatsApp"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
