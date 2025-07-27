import React, { useState } from "react";
import Profil from "./onglets/Profil";
import AjouterProduit from "./onglets/AjouterProduit";
import MesProduits from "./onglets/MesProduits";
import DemandesAffiliation from "./onglets/DemandesAffiliation";

export default function DashboardVendeur() {
  const [activeTab, setActiveTab] = useState("profil");

  const renderContent = () => {
    switch (activeTab) {
      case "profil": return <Profil />;
      case "ajouter": return <AjouterProduit />;
      case "produits": return <MesProduits />;
      case "demandes": return <DemandesAffiliation />;
      default: return <Profil />;
    }
  };

  return (
    <div style={styles.container}>
      {/* ✅ Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.title}>Tableau de Bord</h3>
        <ul style={styles.menu}>
          <li style={styles.menuItem} onClick={() => setActiveTab("profil")}>👤 Profil</li>
          <li style={styles.menuItem} onClick={() => setActiveTab("ajouter")}>➕ Ajouter Produit</li>
          <li style={styles.menuItem} onClick={() => setActiveTab("produits")}>📦 Mes Produits</li>
          <li style={styles.menuItem} onClick={() => setActiveTab("demandes")}>✅ Demandes d’Affiliation</li>
        </ul>
      </div>

      {/* ✅ Contenu dynamique */}
      <div style={styles.content}>{renderContent()}</div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", background: "#f4f4f4" },
  sidebar: { width: "250px", background: "#222", color: "#fff", padding: "20px", display: "flex", flexDirection: "column" },
  title: { marginBottom: "20px", fontSize: "20px", fontWeight: "bold" },
  menu: { listStyle: "none", padding: 0, margin: 0 },
  menuItem: { padding: "10px", cursor: "pointer", borderBottom: "1px solid #333", transition: "background 0.3s" },
  logout: { marginTop: "30px", color: "red", cursor: "pointer", fontWeight: "bold" },
  content: { flex: 1, padding: "20px", background: "#fff", borderRadius: "8px", margin: "10px" }
};
