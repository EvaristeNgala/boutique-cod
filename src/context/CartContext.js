// src/context/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // ✅ Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Ajouter un produit au panier d'un vendeur
  const addToCart = (product, vendeurId) => {
    setCart((prevCart) => {
      const vendeurItems = prevCart[vendeurId] || [];
      const existingItem = vendeurItems.find((item) => item.id === product.id);

      let updatedItems;
      if (existingItem) {
        // Si le produit existe déjà → augmente la quantité
        updatedItems = vendeurItems.map((item) =>
          item.id === product.id ? { ...item, quantite: (item.quantite || 1) + 1 } : item
        );
      } else {
        // Sinon → ajoute un nouveau produit
        updatedItems = [...vendeurItems, { ...product, quantite: 1 }];
      }

      return { ...prevCart, [vendeurId]: updatedItems };
    });
  };

  // ✅ Supprimer un produit du panier d'un vendeur
  const removeFromCart = (productId, vendeurId) => {
    setCart((prevCart) => {
      const vendeurItems = prevCart[vendeurId]?.filter((item) => item.id !== productId) || [];
      return { ...prevCart, [vendeurId]: vendeurItems };
    });
  };

  // ✅ Vider tout le panier d'un vendeur
  const clearCart = (vendeurId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[vendeurId];
      return newCart;
    });
  };

  // ✅ Mettre à jour la quantité d’un produit
  const updateQuantity = (productId, vendeurId, newQuantity) => {
    setCart((prevCart) => {
      const vendeurItems = prevCart[vendeurId]?.map((item) =>
        item.id === productId ? { ...item, quantite: newQuantity } : item
      ) || [];
      return { ...prevCart, [vendeurId]: vendeurItems };
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
