import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [formData, setFormData] = useState({ nom: "", ville: "", adresse: "", commentaire: "" });

  // ✅ Charger le produit depuis Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "produits", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setProduct({ id: snap.id, ...data });

          // ✅ Charger d’autres produits du même vendeur
          const q = query(collection(db, "produits"), where("vendeurId", "==", data.vendeurId));
          const querySnap = await getDocs(q);
          const related = [];
          querySnap.forEach((docSnap) => {
            if (docSnap.id !== id) related.push({ id: docSnap.id, ...docSnap.data() });
          });
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Erreur Firestore:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Envoi de commande vers WhatsApp
  const handleSendOrder = () => {
    if (!product) return;
    const msg = `📦 Nouvelle commande:
👤 Nom: ${formData.nom}
🏙️ Ville: ${formData.ville}
📍 Adresse: ${formData.adresse}
💬 Commentaire: ${formData.commentaire || "Aucun"}
🛒 Produit: ${product.name} - ${product.price}$
`;
    const whatsappUrl = `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
    setShowOrder(false);
    setFormData({ nom: "", ville: "", adresse: "", commentaire: "" });
  };

  if (!product) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Produit introuvable</h2>;

  // ✅ Styles
  const styles = {
    container: { padding: "20px", maxWidth: "1100px", margin: "auto" },
    card: { background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" },
    img: { width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px" },
    name: { fontSize: "1.8rem", fontWeight: "bold" },
    price: { fontSize: "1.4rem", color: "#ff9800", fontWeight: "bold" },
    desc: { fontSize: "1rem", color: "#555" },
    btn: { background: "#222", color: "#fff", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
    backBtn: { background: "#777", marginBottom: "10px" },
    grid: { marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" },
    relatedCard: { background: "#fff", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" },
    relatedImg: { width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
    modal: { background: "#fff", padding: "20px", borderRadius: "12px", width: "90%", maxWidth: "400px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)" },
    input: { width: "100%", padding: "10px", margin: "6px 0", border: "1px solid #ccc", borderRadius: "6px" },
    closeBtn: { background: "red", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", marginTop: "10px", cursor: "pointer" }
  };

  return (
    <div style={styles.container}>
      <button style={{ ...styles.btn, ...styles.backBtn }} onClick={() => navigate(-1)}>⬅ Retour</button>

      {/* ✅ Détails du produit */}
      <div style={styles.card}>
        <img src={product.image} alt={product.name} style={styles.img} />
        <h2 style={styles.name}>{product.name}</h2>
        <p style={styles.price}>{product.price} $</p>
        <p style={styles.desc}>{product.description || "Aucune description disponible."}</p>
        <button style={styles.btn} onClick={() => setShowOrder(true)}>📦 Commander</button>
      </div>

      {/* ✅ Produits liés */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 style={{ marginTop: "30px" }}>🛍 Autres produits de cette boutique :</h3>
          <div style={styles.grid}>
            {relatedProducts.map((p) => (
              <div key={p.id} style={styles.relatedCard} onClick={() => navigate(`/produit/${p.id}`)}>
                <img src={p.image} alt={p.name} style={styles.relatedImg} />
                <h4>{p.name}</h4>
                <p style={{ color: "#ff9800", fontWeight: "bold" }}>{p.price} $</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Popup Commande */}
      {showOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowOrder(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Commander : {product.name}</h3>
            <input style={styles.input} placeholder="Nom complet" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
            <input style={styles.input} placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({ ...formData, ville: e.target.value })} />
            <input style={styles.input} placeholder="Adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
            <textarea style={styles.input} placeholder="Commentaire (facultatif)" value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })} />
            <button style={styles.btn} onClick={handleSendOrder}>✅ Envoyer la commande</button>
            <button style={styles.closeBtn} onClick={() => setShowOrder(false)}>❌ Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
