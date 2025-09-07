// ✅ src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import NavbarVendeur from "./components/NavbarVendeur";
import Shop from "./pages/Shop";
import Cart from "./pages/cart";
import Login from "./pages/Login";
import DevenirVendeur from "./pages/DevenirVendeur";
import DevenirAffilie from "./pages/DevenirAffilie";
import DashboardVendeur from "./pages/DashboardVendeur";
import Produit from "./pages/Produit";
import RegisterVisitor from "./pages/RegisterVisitor";
import ProduitsBoutique from "./pages/ProduitsBoutique";
import AproposBoutique from "./pages/AproposBoutique";
import ContactBoutique from "./pages/ContactBoutique";
import ProduitDetail from "./pages/ProduitDetail";

// ✅ Layout dynamique : affiche NavbarVendeur uniquement pour les pages boutique
function Layout({ children }) {
  const location = useLocation();
  const isVendeurSite = location.pathname.startsWith("/boutique/");
  return (
    <>
      {isVendeurSite ? <NavbarVendeur /> : <Navbar />}
      <div className="container">{children}</div>
    </>
  );
}

export default function App() {
  const vendeurId = "ZSuUym3iAegl0jDfEncHTCb0FgG2"; // ID du vendeur par défaut

  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ✅ Redirection "/" vers la page ProduitsBoutique du vendeur par défaut */}
            <Route path="/" element={<Navigate to={`/boutique/${vendeurId}/produits`} replace />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/produit/:id" element={<Produit />} />

            {/* ✅ Authentification Vendeur */}
            <Route path="/login" element={<Login />} />
            <Route path="/devenir-vendeur" element={<DevenirVendeur />} />
            <Route path="/devenir-affilie" element={<DevenirAffilie />} />
            <Route path="/dashboard-vendeur" element={<DashboardVendeur />} />

            {/* ✅ Espace Boutique Vendeur */}
            <Route path="/boutique/:vendeurId/cart" element={<Cart />} />
            <Route path="/boutique/:vendeurId/register" element={<RegisterVisitor />} />
            <Route path="/boutique/:vendeurId/login" element={<Login />} />
            
            {/* ✅ Page Produits = nouvelle "page d'accueil" boutique */}
            <Route path="/boutique/:vendeurId" element={<Navigate to={`/boutique/${vendeurId}/produits`} replace />} />
            <Route path="/boutique/:vendeurId/produits" element={<ProduitsBoutique />} />
            <Route path="/boutique/:vendeurId/produit/:produitId" element={<ProduitDetail />} />
            <Route path="/boutique/:vendeurId/apropos" element={<AproposBoutique />} />
            <Route path="/boutique/:vendeurId/contact" element={<ContactBoutique />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}
