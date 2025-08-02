// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import NavbarVendeur from "./components/NavbarVendeur";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Cart from "./pages/cart"; // ✅ corrigé avec minuscule
import Login from "./pages/Login";
import DevenirVendeur from "./pages/DevenirVendeur";
import DevenirAffilie from "./pages/DevenirAffilie";
import DashboardVendeur from "./pages/DashboardVendeur";
import Produit from "./pages/Produit";
import BoutiqueVendeur from "./pages/BoutiqueVendeur";
import RegisterVisitor from "./pages/RegisterVisitor";

// ✅ Layout qui choisit la bonne navbar
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
            {/* ✅ Routes principales */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/devenir-vendeur" element={<DevenirVendeur />} />
            <Route path="/devenir-affilie" element={<DevenirAffilie />} />
            <Route path="/dashboard-vendeur" element={<DashboardVendeur />} />
            <Route path="/produit/:id" element={<Produit />} />

            {/* ✅ Routes vendeur */}
            <Route path="/boutique/:vendeurId" element={<BoutiqueVendeur />} />
            <Route path="/boutique/:vendeurId/cart" element={<Cart />} /> 
            <Route path="/boutique/:vendeurId/register" element={<RegisterVisitor />} />
            <Route path="/boutique/:vendeurId/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}
