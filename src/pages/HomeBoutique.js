// ✅ src/pages/HomeBoutique.jsx (optimisé mobile)
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, limit } from "firebase/firestore";

export default function HomeBoutique() {
  const { vendeurId } = useParams();
  const [vendeur, setVendeur] = useState(null);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 🔹 Récupération des infos du vendeur
        const vendeurRef = doc(db, "vendeurs", vendeurId);
        const vendeurSnap = await getDoc(vendeurRef);
        if (vendeurSnap.exists()) setVendeur(vendeurSnap.data());

        // 🔹 Récupération des premiers produits (4 max pour la page d’accueil)
        const produitsRef = collection(db, `vendeurs/${vendeurId}/produits`);
        const q = query(produitsRef, limit(4));
        const querySnap = await getDocs(q);
        setProduits(querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("❌ Erreur lors du chargement de la boutique :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [vendeurId]);

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Chargement de la boutique...</p>;
  if (!vendeur) return <p style={{ textAlign: "center", color: "red" }}>❌ Boutique introuvable.</p>;

  // ✅ Styles optimisés mobile + desktop
  const styles = {
    banner: {
      background: "linear-gradient(120deg, #0a1f44, #1e3a8a)",
      color: "white",
      padding: "40px 15px",
      textAlign: "center",
      borderRadius: "0 0 20px 20px",
    },
    title: {
      fontSize: "clamp(20px, 4vw, 28px)",
      margin: "10px 0",
    },
    subtitle: {
      fontSize: "clamp(14px, 2vw, 18px)",
      marginBottom: 15,
    },
    products: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: "15px",
      padding: "15px",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: 10,
      padding: 10,
      textAlign: "center",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
    },
    img: {
      width: "100%",
      height: "auto",
      maxHeight: 160,
      objectFit: "cover",
      borderRadius: 8,
    },
    btn: {
      display: "inline-block",
      marginTop: 10,
      background: "#0a1f44",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: 5,
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "clamp(14px, 2vw, 16px)",
    },
    btnWhatsApp: {
      background: "#25D366",
      marginTop: 10,
      display: "inline-block",
      padding: "10px 18px",
      borderRadius: 5,
      color: "#fff",
      fontWeight: "bold",
      textDecoration: "none",
    },
  };

  return (
    <div>
      {/* 🔹 Bannière d'accueil */}
      <div style={styles.banner}>
        <h1 style={styles.title}>🛍️ {vendeur.nomBoutique}</h1>
        <p style={styles.subtitle}>Bienvenue dans notre boutique en ligne ! Découvrez nos produits exclusifs.</p>
        {vendeur.telephone && (
          <a href={`https://wa.me/${vendeur.telephone}`} style={styles.btnWhatsApp}>
            📞 Contacter sur WhatsApp
          </a>
        )}
      </div>

      {/* 🔹 Produits en vedette */}
      <h2 style={{ textAlign: "center", marginTop: 20 }}>✨ Produits en vedette</h2>
      {produits.length > 0 ? (
        <div style={styles.products}>
          {produits.map((p) => (
            <div key={p.id} style={styles.card}>
              <img src={p.imageUrl || "/placeholder.png"} alt={p.nom} style={styles.img} />
              <h4>{p.nom}</h4>
              <p><strong>{p.prix} $</strong></p>
              <Link to={`/boutique/${vendeurId}/produit/${p.id}`} style={styles.btn}>
                Voir
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Aucun produit pour le moment.</p>
      )}

      {/* 🔹 Lien vers tous les produits */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Link to={`/boutique/${vendeurId}/produits`} style={styles.btn}>
          Voir tous les produits ➜
        </Link>
      </div>
    </div>
  );
}
