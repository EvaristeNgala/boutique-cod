// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Login from "./pages/Login";
import DevenirVendeur from "./pages/DevenirVendeur";
import DevenirAffilie from "./pages/DevenirAffilie";
import DashboardVendeur from "./pages/DashboardVendeur";
import Produit from "./pages/Produit";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/devenir-vendeur" element={<DevenirVendeur />} />
            <Route path="/devenir-affilie" element={<DevenirAffilie />} />
            <Route path="/dashboard-vendeur" element={<DashboardVendeur />} />
            <Route path="/produit/:id" element={<Produit />} />

          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}
