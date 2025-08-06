// ✅ src/pages/ProduitsBoutique.jsx
// ✅ Correction ProduitsBoutique.jsx : utiliser addToCart correctement
import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProduitsBoutique() {
  const { vendeurId } = useParams();
  const [produits, setProduits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [vendeurPhone, setVendeurPhone] = useState("");
  const { addToCart } = useContext(CartContext);

  // 🔹 Charger les produits du vendeur
  useEffect(() => {
    async function fetchProduits() {
      try {
        if (!vendeurId) return;
        const produitsRef = collection(db, "produits");
        const q = query(produitsRef, where("vendeurId", "==", vendeurId));
        const querySnap = await getDocs(q);
        const data = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProduits(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Erreur récupération produits :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduits();
  }, [vendeurId]);

  // 🔹 Récupérer téléphone du vendeur
  useEffect(() => {
    async function fetchVendeur() {
      if (!vendeurId) return;
      const vendeurRef = doc(db, "vendeurs", vendeurId);
      const vendeurSnap = await getDoc(vendeurRef);
      if (vendeurSnap.exists()) setVendeurPhone(vendeurSnap.data().telephone);
    }
    fetchVendeur();
  }, [vendeurId]);

  // 🔹 Recherche
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(produits.filter((p) => p.name.toLowerCase().includes(value)));
  };

  // 🔹 Ajouter produit au panier
  const handleAddToCart = (produit) => {
    addToCart(produit, vendeurId); // ✅ Correction : produit en premier, vendeurId en second
  };

  // 🔹 Popup commande
  const openPopup = (produit) => { setSelectedProduit(produit); setPopupOpen(true); };
  const closePopup = () => setPopupOpen(false);

  const sendWhatsAppOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const infos = Object.fromEntries(formData.entries());
    const msg = `📦 *Commande : ${selectedProduit.name}*%0A👤 Nom: ${infos.nom}%0A🌍 Pays: ${infos.pays}%0A🏙️ Ville: ${infos.ville}%0A📍 Adresse: ${infos.adresse}%0A🔖 Ref: ${infos.reference}%0A🎨 Couleur: ${infos.couleur}%0A📏 Taille: ${infos.taille}%0A🔢 Quantité: ${infos.quantite}%0A📝 Avis: ${infos.avis}`;
    window.open(`https://wa.me/${vendeurPhone}?text=${msg}`, "_blank");
    closePopup();
  };

  if (loading) return <p>⏳ Chargement des produits...</p>;

  return (
    <div style={styles.container}>
      <input type="text" placeholder="🔍 Rechercher un produit..." value={search} onChange={handleSearch} style={styles.search} />
      {filtered.length === 0 ? <p>⚠️ Aucun produit trouvé.</p> : (
        <div style={styles.grid}>
          {filtered.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.imageContainer} onMouseEnter={(e) => e.currentTarget.querySelector("button").style.opacity = 1} onMouseLeave={(e) => e.currentTarget.querySelector("button").style.opacity = 0}>
                <img src={p.image} alt={p.name} style={styles.img} />
                <button style={styles.commandBtn} onClick={() => openPopup(p)}>Commander</button>
              </div>
              <p style={styles.desc}>{p.description}</p>
              <p style={styles.price}>{p.price} $ / pièce</p>
              <button style={styles.addBtn} onClick={() => handleAddToCart(p)}>➕ Ajouter au panier</button>
            </div>
          ))}
        </div>
      )}

      {popupOpen && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.header}><h4 style={{ margin: 0, color: "#fff" }}>Passer la commande pour {selectedProduit?.name}</h4></div>
            <form onSubmit={sendWhatsAppOrder} style={styles.form}>
              <input name="nom" placeholder="Nom complet" required style={styles.input} />
              <input name="pays" defaultValue="Kinshasa" style={styles.input} />
              <input name="ville" placeholder="Ville" required style={styles.input} />
              <input name="adresse" placeholder="Adresse" required style={styles.input} />
              <input name="reference" placeholder="Référence (facultatif)" style={styles.input} />
              <input name="taille" placeholder="Taille" style={styles.input} />
              <input name="couleur" placeholder="Couleur" style={styles.input} />
              <input name="quantite" type="number" defaultValue="1" min="1" style={styles.input} />
              <textarea name="avis" placeholder="Avis (facultatif)" style={styles.textarea}></textarea>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="button" onClick={closePopup} style={styles.cancelBtn}>❌ Annuler</button>
                <button type="submit" style={styles.sendBtn}>Envoyer la commande</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles identiques à ta version actuelle

const styles = {
  container: { padding: "20px" },
  search: { width: "95%", padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "10px", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  imageContainer: { position: "relative", overflow: "hidden", borderRadius: "8px", marginBottom: "5px" },
  img: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" },
  commandBtn: { position: "absolute", top: "10px", right: "10px", background: "#1e90ff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", opacity: 0, transition: "opacity 0.3s", cursor: "pointer" },
  desc: { fontSize: "14px", color: "#555" },
  price: { margin: "5px 0" },
  addBtn: { width: "100%", background: "#28a745", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", marginTop: "5px" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  popup: { background: "#fff", borderRadius: "8px", width: "400px", maxWidth: "90%", overflow: "hidden" },
  header: { background: "#0a1f44", padding: "10px", textAlign: "center" },
  form: { padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "5px" },
  textarea: { padding: "8px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "60px" },
  cancelBtn: { background: "#ccc", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" },
  sendBtn: { background: "#1e90ff", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" },
};
