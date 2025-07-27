import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Shop() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ nom: "", ville: "", adresse: "", commentaire: "" });
  const [produits, setProduits] = useState([]); // 🔥 Produits récupérés depuis Firebase
  const navigate = useNavigate();

  // ✅ Récupération des produits depuis Firestore
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "produits"));
        const produitsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProduits(produitsArray);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };
    fetchProduits();
  }, []);

  // ✅ Détection mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Envoi commande (WhatsApp)
  const handleSendOrder = () => {
    if (!selectedProduct) return;
    const msg = `📦 Nouvelle commande:
👤 Nom: ${formData.nom}
🏙️ Ville: ${formData.ville}
📍 Adresse: ${formData.adresse}
💬 Commentaire: ${formData.commentaire || "Aucun"}
🛒 Produit: ${selectedProduct.name} - ${selectedProduct.price}$
`;
    // Ici tu peux utiliser un numéro générique ou un champ vendeur dans Firebase
    const whatsappUrl = `https://wa.me/${selectedProduct.vendeurNumero || "243000000000"}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
    setSelectedProduct(null);
    setFormData({ nom: "", ville: "", adresse: "", commentaire: "" });
  };

  // ✅ Styles
  const styles = {
    container: { padding: "20px", background: "#f4f6f8", minHeight: "100vh" },
    grid: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "auto" },
    card: { background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden", transition: "transform 0.3s", cursor: "pointer" },
    img: { width: "100%", height: isMobile ? "200px" : "250px", objectFit: "cover" },
    info: { padding: "15px", textAlign: "left" },
    name: { fontSize: "1.2rem", fontWeight: "bold" },
    price: { color: "#ff9800", fontWeight: "bold", fontSize: "1.1rem" },
    btn: { background: "#222", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", width: "100%", cursor: "pointer", marginTop: "8px", transition: "background 0.3s" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeIn 0.3s" },
    modal: { background: "#fff", padding: "20px", borderRadius: "12px", width: "90%", maxWidth: "400px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)", animation: "slideUp 0.3s" },
    input: { width: "90%", padding: "10px", margin: "6px 0", border: "1px solid #ccc", borderRadius: "6px" },
    closeBtn: { background: "red", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", marginTop: "10px", cursor: "pointer",justifyContent: "center", alignItems: "center" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {produits.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>⏳ Chargement des produits...</p>
        ) : (
          produits.map((p) => (
            <div key={p.id} style={styles.card}>
              <img src={p.image} alt={p.name} style={styles.img} />
              <div style={styles.info}>
                <h3 style={styles.name}>{p.name}</h3>
                <p style={styles.price}>{p.price} $</p>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>{p.description?.substring(0, 60)}...</p>

                {/* ✅ Commander */}
                <button style={styles.btn} onClick={() => setSelectedProduct(p)}>📦 Commander</button>

                {/* ✅ Voir produit */}
                <button style={{ ...styles.btn, background: "#555" }} onClick={() => navigate(`/produit/${p.id}`)}>
                  👁 Voir le produit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Popup Commande */}
      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Commander : {selectedProduct.name}</h3>
            <input style={styles.input} placeholder="Nom complet" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
            <input style={styles.input} placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({ ...formData, ville: e.target.value })} />
            <input style={styles.input} placeholder="Adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
            <textarea style={styles.input} placeholder="Commentaire (facultatif)" value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })} />
            <button style={styles.btn} onClick={handleSendOrder}>✅ Envoyer la commande</button>
            <button style={styles.closeBtn} onClick={() => setSelectedProduct(null)}>❌ Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
