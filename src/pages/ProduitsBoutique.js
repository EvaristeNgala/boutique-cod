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

  // Pour popup ajout au panier
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

  // Récupérer téléphone vendeur
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
    setSelectedTaille("");
    setSelectedCouleur("");
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
      nom: selectedProduit.nom || selectedProduit.name || "",
      name: selectedProduit.name || selectedProduit.nom || "",
      price: selectedProduit.price ?? selectedProduit.prix ?? 0,
      oldPrice: selectedProduit.oldPrice ?? null,
      image: selectedProduit.image || "",
      description: selectedProduit.description || "",
      taille: selectedTaille || null,
      couleur: selectedCouleur || null,
      quantite: quantite || 1,
    };

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
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/boutique/${vendeurId}/produit/${p.id}`)}
              >
                <img src={p.image} alt={p.nom || p.name} style={styles.img} />
              </div>

              <p style={styles.title}>{p.nom || p.name}</p>

              <p style={styles.desc}>
                {p.description && p.description.length > 50
                  ? p.description.substring(0, 50) + "..."
                  : p.description}
              </p>

              <div style={styles.priceBox}>
                {p.oldPrice && (
                  <span style={styles.oldPrice}>{p.oldPrice} UDS</span>
                )}
                <span style={styles.newPrice}>
                  {(p.price ?? p.prix ?? 0)} UDS
                </span>
              </div>
              <button style={styles.addBtn} onClick={() => openAddToCartPopup(p)}>
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Ajouter au panier */}
      {popupAddToCartOpen && selectedProduit && (
        <div style={styles.overlay} onClick={closeAddToCartPopup}>
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
                <div style={styles.selectedBox}>
                  {selectedTaille || (selectedProduit.tailles?.length > 0 ? "Aucune" : "—")}
                </div>
              </div>

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
                <input
                  type="text"
                  placeholder="Entrez votre taille"
                  value={selectedTaille}
                  onChange={(e) => setSelectedTaille(e.target.value)}
                  style={{ ...styles.input, marginTop: 5 }}
                />
              )}

              {/* Couleur */}
              <div style={{ marginTop: 15 }}>
                <strong>Couleur sélectionnée : </strong>
                <div style={styles.selectedBox}>
                  {selectedCouleur || (selectedProduit.couleurs?.length > 0 ? "Aucune" : "—")}
                </div>
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
                <input
                  type="text"
                  placeholder="Entrez votre couleur"
                  value={selectedCouleur}
                  onChange={(e) => setSelectedCouleur(e.target.value)}
                  style={{ ...styles.input, marginTop: 5 }}
                />
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  onClick={closeAddToCartPopup}
                  style={styles.cancelBtn}
                >
                  ❌ Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddToCart}
                  style={styles.sendBtn}
                >
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
  search: {
    width: "95%",
    padding: "10px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "8px",
    background: "#fff",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  img: {
    width: "100%",
    height: "auto",
    maxHeight: "250px",
    objectFit: "contain",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "6px",
    marginBottom: "4px",
    color: "#222",
  },
  desc: { fontSize: "12px", color: "#555", marginBottom: "6px" },
  priceBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "6px",
  },
  oldPrice: {
    textDecoration: "line-through",
    fontSize: "12px",
    color: "#999",
  },
  newPrice: {
    fontWeight: "bold",
    color: "#e60023",
    fontSize: "14px",
  },
  addBtn: {
    width: "100%",
    background: "#0a1f44",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "auto",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    background: "#fff",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  header: { background: "#0a1f44", padding: "10px", textAlign: "center" },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  cancelBtn: {
    background: "#ccc",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    flex: 1,
    marginRight: 8,
  },
  sendBtn: {
    background: "#1e90ff",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    flex: 1,
    marginLeft: 8,
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "6px",
  },
  optionBox: {
    border: "1px solid #ccc",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    userSelect: "none",
  },
  optionSelected: {
    backgroundColor: "#28a745",
    color: "white",
    borderColor: "#28a745",
  },
  selectedBox: {
    marginTop: "5px",
    padding: "8px 12px",
    border: "1px solid #28a745",
    borderRadius: "5px",
    fontWeight: "bold",
    display: "inline-block",
  },
};
