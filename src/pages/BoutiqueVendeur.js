// src/pages/BoutiqueVendeur.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { CartContext } from "../context/CartContext";

export default function BoutiqueVendeur() {
  const { vendeurId } = useParams();
  const { addToCart } = useContext(CartContext);

  const [produits, setProduits] = useState([]);
  const [vendeur, setVendeur] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    adresse: "",
    couleur: "",
    taille: "",
    quantite: 1,
    commentaire: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les produits
        const q = query(collection(db, "produits"), where("vendeurId", "==", vendeurId));
        const querySnap = await getDocs(q);
        setProduits(querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Récupérer infos vendeur (notamment numéro whatsapp)
        const vendeurRef = doc(db, "vendeurs", vendeurId);
        const vendeurSnap = await getDoc(vendeurRef);
        if (vendeurSnap.exists()) setVendeur(vendeurSnap.data());
      } catch (err) {
        console.error("Erreur Firestore:", err);
      }
    };
    fetchData();
  }, [vendeurId]);

  // Ouvre popup et sélectionne produit
  const ouvrirPopup = (produit) => {
    setSelectedProduct(produit);
    setShowPopup(true);
  };

  // Fermer popup
  const fermerPopup = () => {
    setShowPopup(false);
    setFormData({
      nom: "",
      ville: "",
      adresse: "",
      couleur: "",
      taille: "",
      quantite: 1,
      commentaire: "",
    });
  };

  // Envoyer commande via whatsapp
  const envoyerCommande = () => {
    if (!vendeur?.whatsapp) {
      alert("Numéro WhatsApp vendeur introuvable !");
      return;
    }
    if (!selectedProduct) {
      alert("Produit non sélectionné");
      return;
    }

    const msg = `📦 *Nouvelle commande* :
🛒 Produit : ${selectedProduct.name}
💰 Prix : ${selectedProduct.price}$
📏 Taille : ${formData.taille || "Non précisé"}
🎨 Couleur : ${formData.couleur || "Non précisé"}
🔢 Quantité : ${formData.quantite}

👤 Nom : ${formData.nom}
🏙️ Ville : ${formData.ville}
📍 Adresse : ${formData.adresse}
💬 Commentaire : ${formData.commentaire || "Aucun"}`;

    window.open(`https://wa.me/${vendeur.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    fermerPopup();
  };

  // Ajouter au panier classique
  const ajouterAuPanier = (produit) => {
    addToCart(produit, vendeurId);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="grid-produits">
        {produits.map((p) => (
          <div key={p.id} className="card-produit">
            <div className="image-container">
              <img src={p.image} alt={p.name} />
              <button className="btn-commande" onClick={() => ouvrirPopup(p)}>Commander</button>
            </div>
            <p className="desc">{p.description}</p>
            <div className="bloc">
                <p className="prix">{p.price} $US</p>
                <p className="piece">(1 pièce)</p>
            </div>
            
            <button className="btn-panier" onClick={() => ajouterAuPanier(p)}>+ Panier</button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={fermerPopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h3>Commander : {selectedProduct.name}</h3>

            <input
              type="text"
              placeholder="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ville"
              value={formData.ville}
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            />
            <input
              type="text"
              placeholder="Adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            />
            <input
              type="text"
              placeholder="Couleur"
              value={formData.couleur}
              onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
            />
            <input
              type="text"
              placeholder="Taille"
              value={formData.taille}
              onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
            />
            <input
              type="number"
              min="1"
              placeholder="Quantité"
              value={formData.quantite}
              onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
            />
            <textarea
              placeholder="Commentaire"
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
            />

            <button className="btn-send" onClick={envoyerCommande}>Envoyer commande via WhatsApp</button>
            <button className="btn-cancel" onClick={fermerPopup}>Annuler</button>
          </div>
        </div>
      )}

      <style>{`
        .grid-produits {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 5px;
        }
        .card-produit {
          background: #fff;
          padding: 3px;
          border-radius: 10px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        .image-container img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }
        /* Bouton commander au survol */
        .btn-commande {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          opacity: 0;
          transition: opacity 0.3s ease;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .image-container:hover .btn-commande {
          opacity: 1;
        }
        /* Toujours visible sur mobile (pas de hover) */
        @media (hover: none) {
          .btn-commande {
            opacity: 1 !important;
          }
        }

        .prix {
          font-weight: bold;
          color: #222221ff;
        }
        .desc {
          color: #555;
          font-size: 0.9rem;
          margin-bottom: -10px;
        }

        .piece {
          color: #555;
          font-size: 0.9rem;
        }

        .bloc {
            display:flex;
            gap: 10px;
            align-items: center;
            margin-bottom: -10px;
        }
        .btn-panier {
          width: 100%;
          padding: 8px;
          border: 0.5px solid #555;
          border-radius: 20px;  
          color: #555;
          margin-top: 8px;
          cursor: pointer;
          background: white;    
        }

        /* Popup styles */
        .popup-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .popup-content {
          background: white;
          border-radius: 10px;
          padding: 20px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .popup-content input,
        .popup-content textarea {
          padding: 8px;
          font-size: 1rem;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 95%;
          resize: vertical;
        }
        .popup-content textarea {
          min-height: 60px;
        }
        .btn-send {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .btn-send:hover {
          background: #218838;
        }
        .btn-cancel {
          background: #dc3545;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .btn-cancel:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  );
}
