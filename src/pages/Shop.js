// src/pages/Shop.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Shop() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    nom: "", ville: "", adresse: "", couleur: "", taille: "", quantite: 1, commentaire: ""
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      const querySnap = await getDocs(collection(db, "produits"));
      setProduits(querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProduits();
  }, []);

  const ajouterAuPanier = (produit) => {
    const exist = panier.find(p => p.id === produit.id);
    if (exist) {
      setPanier(panier.map(p => p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
  };

  const ouvrirPopup = (produit) => {
    setSelectedProduct(produit);
    setShowPopup(true);
  };

  const envoyerCommande = () => {
    if (!selectedProduct) return;

    const msg = `📦 Nouvelle commande :
🛒 Produit : ${selectedProduct.name}
💰 Prix : ${selectedProduct.price}$
📏 Taille : ${formData.taille || "Non précisé"}
🎨 Couleur : ${formData.couleur || "Non précisé"}
🔢 Quantité : ${formData.quantite}

👤 Nom : ${formData.nom}
🏙️ Ville : ${formData.ville}
📍 Adresse : ${formData.adresse}
💬 Commentaire : ${formData.commentaire || "Aucun"}
`;

    const whatsappUrl = `https://wa.me/${selectedProduct.whatsapp || "243000000000"}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");

    setShowPopup(false);
    setFormData({ nom: "", ville: "", adresse: "", couleur: "", taille: "", quantite: 1, commentaire: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍 Tous les produits</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: "15px" }}>
        {produits.map((p) => (
          <div key={p.id} style={{ background: "#fff", padding: 10, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }} />
            <h3>{p.name}</h3>
            <p style={{ color: "#ff9800", fontWeight: "bold" }}>{p.price} $</p>
            <p style={{ color: "#28a745" }}>Stock : {p.stock || 0}</p>

            <div style={{ display: "flex", gap: "5px", marginTop: 5 }}>
              <button onClick={() => ajouterAuPanier(p)} style={{ flex: 1, borderRadius: 20, background: "#003366", color: "#fff", padding: 8, border: "none" }}>+ Panier</button>
              <button onClick={() => ouvrirPopup(p)} style={{ flex: 1, borderRadius: 20, background: "#007bff", color: "#fff", padding: 8, border: "none" }}>Commander</button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Popup commande */}
      {showPopup && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: "90%", maxWidth: 400 }}>
            <h3>Commander : {selectedProduct?.name}</h3>
            <input placeholder="Nom complet" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <input placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({ ...formData, ville: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <input placeholder="Adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <input placeholder="Couleur (facultatif)" value={formData.couleur} onChange={(e) => setFormData({ ...formData, couleur: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <input placeholder="Taille (facultatif)" value={formData.taille} onChange={(e) => setFormData({ ...formData, taille: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <input type="number" placeholder="Quantité" value={formData.quantite} min="1" onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <textarea placeholder="Commentaire" value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })} style={{ width: "100%", marginTop: 5 }} />
            <button onClick={envoyerCommande} style={{ width: "100%", background: "#28a745", color: "#fff", padding: 10, marginTop: 10, border: "none", borderRadius: 5 }}>✅ Envoyer la commande</button>
            <button onClick={() => setShowPopup(false)} style={{ width: "100%", background: "red", color: "#fff", padding: 10, marginTop: 5, border: "none", borderRadius: 5 }}>❌ Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
