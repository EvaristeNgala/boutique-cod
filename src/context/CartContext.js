import React, { createContext, useState, useEffect } from "react";

// ✅ Création du contexte
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // ✅ Charger le panier depuis localStorage s'il existe
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Ajouter un produit
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // ✅ Supprimer un produit par index
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // ✅ Vider tout le panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
