// src/pages/ProduitDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProduitDetail() {
  const { produitId } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTaille, setSelectedTaille] = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState("");
  const [quantite, setQuantite] = useState(1);

  // Popup formulaire
  const [showForm, setShowForm] = useState(false);

  // Numéro du vendeur
  const [vendeurTel, setVendeurTel] = useState("");

  // Données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    pays: "",
    ville: "",
    adresse: "",
    avis: "",
  });

  useEffect(() => {
    async function fetchProduitEtVendeur() {
      setLoading(true);

      try {
        const produitRef = doc(db, "produits", produitId);
        const produitSnap = await getDoc(produitRef);

        if (produitSnap.exists()) {
          const dataProduit = produitSnap.data();
          setProduit(dataProduit);
          setSelectedTaille(dataProduit.tailles?.[0] || "");
          setSelectedCouleur(dataProduit.couleurs?.[0] || "");

          if (dataProduit.vendeurId) {
            const vendeurRef = doc(db, "vendeurs", dataProduit.vendeurId);
            const vendeurSnap = await getDoc(vendeurRef);

            if (vendeurSnap.exists()) {
              const vendeurData = vendeurSnap.data();
              setVendeurTel(vendeurData.telephone || "");
            } else {
              console.warn("Vendeur non trouvé dans la collection vendeurs.");
              setVendeurTel("");
            }
          } else {
            console.warn("Produit sans vendeurId.");
            setVendeurTel("");
          }
        } else {
          console.warn("Produit non trouvé.");
          setProduit(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        setProduit(null);
      }

      setLoading(false);
    }
    fetchProduitEtVendeur();
  }, [produitId]);

  const handleCommander = () => {
    // Modifier la validation :
    // Si le produit a des tailles, taille doit être sélectionnée
    if (produit?.tailles?.length > 0 && !selectedTaille) {
      alert("Veuillez sélectionner la taille.");
      return;
    }
    // Si le produit a des couleurs, couleur doit être sélectionnée
    if (produit?.couleurs?.length > 0 && !selectedCouleur) {
      alert("Veuillez sélectionner la couleur.");
      return;
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendWhatsAppOrder = (e) => {
    e.preventDefault();

    if (!vendeurTel) {
      alert("Numéro du vendeur introuvable.");
      return;
    }

    const { nom, pays, ville, adresse, avis } = formData;

    if (!nom || !pays || !ville || !adresse) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const message =
      `📦 *Commande : ${produit.nom || produit.name}*\n` +
      `👤 Nom: ${nom}\n` +
      `🌍 Pays: ${pays}\n` +
      `🏙️ Ville: ${ville}\n` +
      `📍 Adresse: ${adresse}\n` +
      `🎨 Couleur: ${selectedCouleur || "Aucune"}\n` +
      `📏 Taille: ${selectedTaille || "Aucune"}\n` +
      `🔢 Quantité: ${quantite}\n` +
      `📝 Avis: ${avis || "Aucun"}`;

    const telNettoye = vendeurTel.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${telNettoye}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
    setShowForm(false);
  };

  if (loading) return <p>⏳ Chargement du produit...</p>;
  if (!produit) return <p>Produit non trouvé.</p>;

  return (
    <div>
      <div
        style={{
          position: "relative",
          top: 0,
          left: 0,
          backgroundColor: "#ffc107ce",
          color: "white",
          padding: "5px 15px 8px 15px",
          fontSize: 16,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        Votre commande sera traitée rapidement et livrée chez vous. Paiement 100% à la livraison.
      </div>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "8px 15px",
          fontSize: 14,
          color: "#555",
          borderBottom: "1px solid #ddd",
        }}
      >
        {produit.categorie
          ? `${produit.categorie} > ${produit.nom || produit.name}`
          : produit.nom || produit.name}
      </div>

      <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
        <img
          src={produit.image}
          alt={produit.nom || produit.name}
          style={{ width: "100%", height: 400, marginBottom: 15, objectFit: "cover" }}
        />

        <p>{produit.description}</p>
        <p style={{ fontWeight: "bold", fontSize: 20 }}>{produit.price} $</p>

        {/* Taille */}
        <div style={{ marginTop: 20 }}>
          <strong>Taille: </strong>
          <div style={styles.selectedBox}>{selectedTaille || (produit.tailles?.length > 0 ? "Aucune" : "—")}</div>
          {produit.tailles?.length > 0 ? (
            <div style={styles.optionsContainer}>
              {produit.tailles.map((taille) => (
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
          ) : (
            <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Ce produit n'a pas d'option de taille.</div>
          )}
        </div>

        {/* Couleur */}
        <div style={{ marginTop: 20 }}>
          <strong>Couleur: </strong>
          <div style={styles.selectedBox}>{selectedCouleur || (produit.couleurs?.length > 0 ? "Aucune" : "—")}</div>
          {produit.couleurs?.length > 0 ? (
            <div style={styles.optionsContainer}>
              {produit.couleurs.map((couleur) => (
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
          ) : (
            <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>Ce produit n'a pas d'option de couleur.</div>
          )}
        </div>

        {/* Quantité */}
        <div style={{ marginTop: 20 }}>
          <strong>Quantité :</strong>
          <input
            type="number"
            name="quantite"
            min="1"
            value={quantite}
            onChange={(e) => setQuantite(Number(e.target.value))}
            style={{ ...styles.input, width: 100, marginTop: 5 }}
          />
        </div>

        {/* Bouton commander */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleCommander}
            style={{
              marginTop: 30,
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              width: 200,
              borderRadius: 5,
            }}
          >
            Commander
          </button>
        </div>
      </div>

      {/* Popup formulaire */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* Bandeau vert collé en haut du popup */}
            <div style={styles.banner}>Veuillez entrer vos informations</div>

            {/* Formulaire */}
            <form onSubmit={sendWhatsAppOrder} style={styles.form}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleInputChange}
                style={styles.input}
                required
              />

              <input
                type="text"
                name="pays"
                placeholder="Pays"
                value={formData.pays}
                onChange={handleInputChange}
                style={styles.input}
                required
              />

              <input
                type="text"
                name="ville"
                placeholder="Ville"
                value={formData.ville}
                onChange={handleInputChange}
                style={styles.input}
                required
              />

              <input
                type="text"
                name="adresse"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                style={styles.input}
                required
              />

              <textarea
                name="avis"
                placeholder="Avis (optionnel)"
                value={formData.avis}
                onChange={handleInputChange}
                style={{ ...styles.input, height: 80, resize: "vertical" }}
              />

              <button type="submit" style={styles.submitBtn}>
                Envoyer la commande
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={styles.cancelBtn}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  selectedBox: {
    marginTop: 5,
    padding: "8px 12px",
    borderRadius: 5,
    fontWeight: "bold",
    display: "inline-block",
    border: "1px solid #ccc",
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  optionBox: {
    border: "1px solid #ccc",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    userSelect: "none",
  },
  optionSelected: {
    backgroundColor: "#0a1f44",
    color: "white",
    borderColor: "#0a1f44",
  },
  input: {
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 5,
    width: "100%",
    marginTop: 8,
    boxSizing: "border-box",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 400,
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    overflow: "hidden",
  },
  banner: {
    backgroundColor: "#28a745",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    padding: "15px",
    textAlign: "center",
    userSelect: "none",
  },
  form: {
    padding: 20,
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    width: "100%",
    marginTop: 10,
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    width: "100%",
    marginTop: 10,
  },
};
