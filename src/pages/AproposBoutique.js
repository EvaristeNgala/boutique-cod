// ✅ src/pages/AproposBoutique.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AproposBoutique() {
  const { vendeurId } = useParams();
  const [vendeur, setVendeur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendeur() {
      try {
        const vendeurRef = doc(db, "vendeurs", vendeurId);
        const vendeurSnap = await getDoc(vendeurRef);
        if (vendeurSnap.exists()) {
          setVendeur(vendeurSnap.data());
        }
      } catch (err) {
        console.error("Erreur chargement vendeur :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVendeur();
  }, [vendeurId]);

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Chargement...</p>;
  if (!vendeur) return <p style={{ textAlign: "center", color: "red" }}>❌ Informations indisponibles.</p>;

  const styles = {
    container: { maxWidth: 800, margin: "20px auto", padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
    header: { textAlign: "center", marginBottom: 20 },
    banner: { width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10, marginBottom: 20 },
    infoBox: { padding: 15, border: "1px solid #ddd", borderRadius: 8, background: "#f9f9f9", marginBottom: 15 },
    label: { fontWeight: "bold" },
    whatsappBtn: { display: "inline-block", background: "#25D366", color: "#fff", padding: "10px 15px", borderRadius: 5, textDecoration: "none", fontWeight: "bold" }
  };

  return (
    <div style={styles.container}>
      {/* 🔹 En-tête */}
      <div style={styles.header}>
        <h1>À propos de {vendeur.nomBoutique}</h1>
        {vendeur.bannerUrl && <img src={vendeur.bannerUrl} alt="Bannière" style={styles.banner} />}
      </div>

      {/* 🔹 Description */}
      <div style={styles.infoBox}>
        <p>Bienvenue chez nous ! Notre boutique est née d’une passion commune pour les belles choses et le service de qualité. Ici, vous trouverez des produits qui racontent une histoire, accompagnés d’un accueil personnalisé et d’un suivi attentif.
        </p>
      </div>

      {/* 🔹 Informations du vendeur */}
      <div style={styles.infoBox}>
        <h3>Informations du vendeur</h3>
        <p><span style={styles.label}>Nom :</span> {vendeur.nom || "Non renseigné"}</p>
        <p><span style={styles.label}>Email :</span> {vendeur.email}</p>
        <p><span style={styles.label}>Téléphone :</span> {vendeur.telephone || "Non disponible"}</p>
        {vendeur.adresse && <p><span style={styles.label}>Adresse :</span> {vendeur.adresse}</p>}
      </div>

      {/* 🔹 Bouton WhatsApp */}
      {vendeur.telephone && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href={`https://wa.me/${vendeur.telephone}`} style={styles.whatsappBtn}>
            📞 Contacter sur WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
