// ✅ src/pages/ProduitsBoutique.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function ProduitsBoutique() {
  const { vendeurId } = useParams();
  const [produits, setProduits] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduits() {
      try {
        const produitsRef = collection(db, `vendeurs/${vendeurId}/produits`);
        const q = query(produitsRef, orderBy("nom"));
        const snap = await getDocs(q);
        setProduits(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erreur chargement produits :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduits();
  }, [vendeurId]);

  // ✅ Filtrer selon recherche
  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Chargement des produits...</p>;

  const styles = {
    container: { padding: 15 },
    searchBox: {
      width: "95%",
      padding: 10,
      marginBottom: 20,
      border: "1px solid #ddd",
      borderRadius: 5,
      fontSize: "1rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 15,
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 10,
      textAlign: "center",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transition: "0.3s",
    },
    img: { width: "100%", height: 150, objectFit: "cover", borderRadius: 5 },
    btn: {
      display: "inline-block",
      marginTop: 10,
      background: "#0a1f44",
      color: "#fff",
      padding: "8px 15px",
      borderRadius: 5,
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Tous les produits</h2>

      {/* ✅ Barre de recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchBox}
      />

      {/* ✅ Liste des produits */}
      {produitsFiltres.length > 0 ? (
        <div style={styles.grid}>
          {produitsFiltres.map((p) => (
            <div key={p.id} style={styles.card}>
              <img src={p.imageUrl || "/placeholder.png"} alt={p.nom} style={styles.img} />
              <h4>{p.nom}</h4>
              <p>{p.prix} $</p>
              <Link to={`/boutique/${vendeurId}/produit/${p.id}`} style={styles.btn}>
                Voir détail ➜
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun produit trouvé.</p>
      )}
    </div>
  );
}
