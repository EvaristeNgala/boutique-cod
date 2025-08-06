// ✅ src/pages/onglets/MesProduits.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MesProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const vendeurId = auth.currentUser?.uid;

  useEffect(() => {
    async function fetchProduits() {
      try {
        if (!vendeurId) return;
        const produitsRef = collection(db, "produits");
        const q = query(produitsRef, where("vendeurId", "==", vendeurId));
        const querySnap = await getDocs(q);
        setProduits(querySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("❌ Erreur récupération produits :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduits();
  }, [vendeurId]);

  const handleDelete = async (id) => {
    if (!window.confirm("❌ Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await deleteDoc(doc(db, "produits", id));
      setProduits(produits.filter((p) => p.id !== id));
      alert("✅ Produit supprimé avec succès !");
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  if (loading) return <p>⏳ Chargement de vos produits...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Produits</h2>
      {produits.length === 0 ? (
        <p>⚠️ Aucun produit ajouté pour le moment.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Prix</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p, index) => (
              <tr key={p.id} style={styles.row}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}><img src={p.image || "/placeholder.png"} alt={p.name} style={styles.img} /></td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.price} $</td>
                <td style={{ ...styles.td, maxWidth: "250px" }}>{p.description}</td>
                <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                  <button style={styles.editBtn} onClick={() => navigate(`/modifier-produit/${p.id}`)}>✏️ Modifier</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "15px", background: "#f9f9f9", borderRadius: "8px" },
  title: { marginBottom: "20px", color: "#0a1f44" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  th: {
    background: "#0a1f44",
    color: "#fff",
    padding: "12px",
    textAlign: "center",
  },
  td: {
    padding: "15px",
    textAlign: "center",
    borderBottom: "1px solid #eee", // ✅ fine ligne de séparation
  },
  row: { background: "#fff" }, // ✅ pas d’alternance de couleurs
  img: { width: 80, height: 80, objectFit: "cover", borderRadius: 8 },
  editBtn: {
    background: "#1e90ff",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    marginRight: "10px", // ✅ espace entre les boutons
    borderRadius: 5,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 5,
    cursor: "pointer",
  },
};
