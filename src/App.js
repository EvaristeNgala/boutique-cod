// ✅ src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import NavbarVendeur from "./components/NavbarVendeur";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Login from "./pages/Login";
import DevenirVendeur from "./pages/DevenirVendeur";
import DevenirAffilie from "./pages/DevenirAffilie";
import DashboardVendeur from "./pages/DashboardVendeur";
import Produit from "./pages/Produit";
//import BoutiqueVendeur from "./pages/BoutiqueVendeur";
import RegisterVisitor from "./pages/RegisterVisitor";
import HomeBoutique from "./pages/HomeBoutique";
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
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ✅ Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/produit/:id" element={<Produit />} />

            {/* ✅ Authentification Vendeur */}
            <Route path="/login" element={<Login />} /> {/* Connexion Vendeur */}
            <Route path="/devenir-vendeur" element={<DevenirVendeur />} />
            <Route path="/devenir-affilie" element={<DevenirAffilie />} />
            <Route path="/dashboard-vendeur" element={<DashboardVendeur />} />

            {/* ✅ Espace Boutique Vendeur */}
            <Route path="/boutique/:vendeurId/cart" element={<Cart />} />

            {/* ✅ Authentification Visiteur pour boutique */}
            <Route path="/boutique/:vendeurId/register" element={<RegisterVisitor />} />
            <Route path="/boutique/:vendeurId/login" element={<Login />} /> {/* Login visiteur */}
            <Route path="/boutique/:vendeurId" element={<HomeBoutique />} />
            <Route path="/boutique/:vendeurId/produits" element={<ProduitsBoutique />} />
            <Route path="/boutique/:vendeurId/apropos" element={<AproposBoutique />} />
            <Route path="/boutique/:vendeurId/contact" element={<ContactBoutique />} />
            <Route path="/boutique/:vendeurId/produit/:produitId" element={<ProduitDetail />} />


          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}
