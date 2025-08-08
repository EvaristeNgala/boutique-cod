// ✅ src/pages/ProduitsBoutique.jsx
import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProduitsBoutique() {
  const { vendeurId } = useParams();
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [popupAddToCartOpen, setPopupAddToCartOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [vendeurPhone, setVendeurPhone] = useState("");
  const { addToCart } = useContext(CartContext);

  // Pour popup ajout au panier : taille, couleur, quantité sélectionnées
  const [selectedTaille, setSelectedTaille] = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState("");
  const [quantite, setQuantite] = useState(1);

  // Charger produits du vendeur
  useEffect(() => {
    async function fetchProduits() {
      try {
        if (!vendeurId) return;
        const produitsRef = collection(db, "produits");
        const q = query(produitsRef, where("vendeurId", "==", vendeurId));
        const querySnap = await getDocs(q);
        const data = querySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  // Récupérer téléphone vendeur (facultatif, utilisé ailleurs si besoin)
  useEffect(() => {
    async function fetchVendeur() {
      if (!vendeurId) return;
      try {
        const vendeurRef = doc(db, "vendeurs", vendeurId);
        const vendeurSnap = await getDoc(vendeurRef);
        if (vendeurSnap.exists()) setVendeurPhone(vendeurSnap.data().telephone || "");
      } catch (err) {
        console.error("❌ Erreur récupération vendeur :", err);
      }
    }
    fetchVendeur();
  }, [vendeurId]);

  // Recherche
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      produits.filter((p) =>
        (p.nom || p.name || "").toLowerCase().includes(value)
      )
    );
  };

  // Ouvrir popup ajout au panier
  const openAddToCartPopup = (produit) => {
    setSelectedProduit(produit);
    // Si le produit a des tailles/couleurs, pré-sélectionner la première option, sinon garder vide
    setSelectedTaille(produit.tailles && produit.tailles.length > 0 ? produit.tailles[0] : "");
    setSelectedCouleur(produit.couleurs && produit.couleurs.length > 0 ? produit.couleurs[0] : "");
    setQuantite(1);
    setPopupAddToCartOpen(true);
  };

  const closeAddToCartPopup = () => {
    setPopupAddToCartOpen(false);
    setSelectedProduit(null);
    setSelectedTaille("");
    setSelectedCouleur("");
    setQuantite(1);
  };

  // Ajouter au panier
  const handleConfirmAddToCart = () => {
    // Ne demander la sélection que si le produit propose des options correspondantes
    if (selectedProduit?.tailles?.length > 0 && !selectedTaille) {
      alert("Veuillez sélectionner la taille.");
      return;
    }
    if (selectedProduit?.couleurs?.length > 0 && !selectedCouleur) {
      alert("Veuillez sélectionner la couleur.");
      return;
    }

    const produitAvecOptions = {
      id: selectedProduit.id,
      // garder les propriétés principales en fallback (nom/price/image/description...)
      nom: selectedProduit.nom || selectedProduit.name || "",
      name: selectedProduit.name || selectedProduit.nom || "",
      price: selectedProduit.price ?? selectedProduit.prix ?? 0,
      image: selectedProduit.image || "",
      description: selectedProduit.description || "",
      // n'ajouter que si présentes — sinon conserver vide ou undefined
      taille: selectedTaille || null,
      couleur: selectedCouleur || null,
      quantite: quantite || 1,
    };

    // addToCart attend (produit, vendeurId) dans ton code existant
    addToCart(produitAvecOptions, vendeurId);
    closeAddToCartPopup();
  };

  if (loading) return <p>⏳ Chargement des produits...</p>;

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {filtered.length === 0 ? (
        <p>⚠️ Aucun produit trouvé.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((p) => (
            <div key={p.id} style={styles.card}>
              <div
                style={{ ...styles.imageContainer, cursor: "pointer" }}
                onClick={() => navigate(`/boutique/${vendeurId}/produit/${p.id}`)}
              >
                <img src={p.image} alt={p.nom || p.name} style={styles.img} />
              </div>

              <p style={styles.desc}>
                {p.description && p.description.length > 150
                  ? p.description.substring(0, 70) + "..."
                  : p.description}
              </p>

              <p style={styles.price}>{(p.price ?? p.prix ?? 0)} $ / pièce</p>

              <button
                style={styles.addBtn}
                onClick={() => openAddToCartPopup(p)}
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Ajouter au panier */}
      {popupAddToCartOpen && selectedProduit && (
        <div style={styles.overlay} onClick={closeAddToCartPopup}>
          {/* prevent overlay click from closing when clicking inside popup */}
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
              <h4 style={{ margin: 0, color: "#fff" }}>
                Ajouter au panier : {selectedProduit.nom || selectedProduit.name}
              </h4>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Taille */}
              <div>
                <strong>Taille sélectionnée : </strong>
                <div style={styles.selectedBox}>{selectedTaille || (selectedProduit.tailles?.length > 0 ? "Aucune" : "—")}</div>
              </div>

              {/* Afficher les options uniquement si le produit en propose */}
              {selectedProduit.tailles && selectedProduit.tailles.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  <div style={styles.optionsContainer}>
                    {selectedProduit.tailles.map((taille) => (
                      <div
                        key={taille}
                        onClick={() => setSelectedTaille(taille)}
                        style={{
                          ...styles.optionBox,
                          ...(selectedTaille === taille ? styles.optionSelected : {}),
                        }}
                      >
                        {taille}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Ce produit n'a pas d'option de taille.</div>
              )}

              {/* Couleur */}
              <div style={{ marginTop: 15 }}>
                <strong>Couleur sélectionnée : </strong>
                <div style={styles.selectedBox}>{selectedCouleur || (selectedProduit.couleurs?.length > 0 ? "Aucune" : "—")}</div>
              </div>

              {selectedProduit.couleurs && selectedProduit.couleurs.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  <div style={styles.optionsContainer}>
                    {selectedProduit.couleurs.map((couleur) => (
                      <div
                        key={couleur}
                        onClick={() => setSelectedCouleur(couleur)}
                        style={{
                          ...styles.optionBox,
                          ...(selectedCouleur === couleur ? styles.optionSelected : {}),
                        }}
                      >
                        {couleur}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Ce produit n'a pas d'option de couleur.</div>
              )}

              {/* Quantité */}
              <div style={{ marginTop: 15 }}>
                <strong>Quantité :</strong>
                <input
                  type="number"
                  min="1"
                  value={quantite}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setQuantite(Number.isNaN(v) || v < 1 ? 1 : v);
                  }}
                  style={{ ...styles.input, width: "100px", marginTop: "5px" }}
                />
              </div>

              {/* Boutons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <button type="button" onClick={closeAddToCartPopup} style={styles.cancelBtn}>
                  ❌ Annuler
                </button>
                <button type="button" onClick={handleConfirmAddToCart} style={styles.sendBtn}>
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "15px" },
  search: { width: "95%", padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "7px" },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "10px", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  imageContainer: { position: "relative", overflow: "hidden", borderRadius: "8px", marginBottom: "5px" },
  img: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" },
  desc: { fontSize: "14px", color: "#555" },
  price: { margin: "5px 0", fontWeight: "600" },
  addBtn: { width: "100%", background: "#1e90ff", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", marginTop: "5px" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  popup: { background: "#fff", borderRadius: "8px", width: "400px", maxWidth: "90%", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
  header: { background: "#0a1f44", padding: "10px", textAlign: "center" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" },
  cancelBtn: { background: "#ccc", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", flex: 1, marginRight: 8 },
  sendBtn: { background: "#1e90ff", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", flex: 1, marginLeft: 8 },
  optionsContainer: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" },
  optionBox: { border: "1px solid #ccc", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", userSelect: "none" },
  optionSelected: { backgroundColor: "#28a745", color: "white", borderColor: "#28a745" },
  selectedBox: { marginTop: "5px", padding: "8px 12px", border: "1px solid #28a745", borderRadius: "5px", fontWeight: "bold", display: "inline-block" },
};
