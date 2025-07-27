import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; // Firestore import
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfilVendeur() {
  const [loading, setLoading] = useState(true);
  const [vendeurData, setVendeurData] = useState({
    nomBoutique: "",
    email: "",
    pourcentageAffiliation: "",
  });
  const [copied, setCopied] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    async function fetchVendeur() {
      const docRef = doc(db, "vendeurs", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVendeurData(docSnap.data());
      } else {
        setVendeurData({
          nomBoutique: "",
          email: auth.currentUser.email,
          pourcentageAffiliation: "",
        });
      }
      setLoading(false);
    }

    fetchVendeur();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendeurData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Utilisateur non connecté");

    try {
      await setDoc(doc(db, "vendeurs", userId), vendeurData, { merge: true });
      alert("Profil mis à jour !");
    } catch (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    }
  };

  const boutiqueLink = `${window.location.origin}/boutique/${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(boutiqueLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h2>Profil Vendeur</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          Nom de la boutique :
          <input
            type="text"
            name="nomBoutique"
            value={vendeurData.nomBoutique}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Email (non modifiable) :
          <input
            type="email"
            name="email"
            value={vendeurData.email}
            disabled
            style={{ width: "100%", padding: "8px", backgroundColor: "#eee" }}
          />
        </label>

        <label>
          Pourcentage d'affiliation (%) :
          <input
            type="number"
            name="pourcentageAffiliation"
            value={vendeurData.pourcentageAffiliation}
            onChange={handleChange}
            min={0}
            max={100}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit" style={{ padding: "10px", backgroundColor: "#222", color: "white", border: "none", borderRadius: 5 }}>
          Mettre à jour
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <div>
        <h3>Votre lien boutique</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="text" readOnly value={boutiqueLink} style={{ flex: 1, padding: "8px" }} />
          <button onClick={copyToClipboard} style={{ padding: "8px 12px", cursor: "pointer" }}>
            {copied ? "Copié ✅" : "Copier"}
          </button>
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 5 }}>
        <h3>Prévisualisation de votre boutique</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Ici on affiche juste le nom de la boutique en style visible */}
          <div
            style={{
              height: 60,
              minWidth: 120,
              backgroundColor: "#222",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "1.4rem",
              borderRadius: 8,
              padding: "0 15px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={vendeurData.nomBoutique}
          >
            {vendeurData.nomBoutique || "Nom boutique"}
          </div>
          <div>
            <h4>{vendeurData.nomBoutique || "Nom boutique"}</h4>
            <p>
              <a href={boutiqueLink} target="_blank" rel="noopener noreferrer">
                Voir boutique
              </a>
            </p>
          </div>
          {/* Tu pourras ajouter ici icône panier si besoin */}
        </div>
      </div>
    </div>
  );
}
