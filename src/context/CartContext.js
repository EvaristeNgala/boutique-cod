import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({}); // panier organisé par vendeurId

  // Ajouter un produit au panier
  const addToCart = (product, vendeurId) => {
    setCart(prevCart => {
      const vendeurCart = prevCart[vendeurId] || [];

      // Chercher produit identique par id + options
      const index = vendeurCart.findIndex(
        item =>
          item.id === product.id &&
          item.taille === product.taille &&
          item.couleur === product.couleur
      );

      let newVendeurCart;

      if (index !== -1) {
        // Produit existant : incrémenter quantité
        newVendeurCart = [...vendeurCart];
        newVendeurCart[index].quantite += product.quantite || 1;
      } else {
        // Nouveau produit : ajouter au panier
        newVendeurCart = [...vendeurCart, { ...product, quantite: product.quantite || 1 }];
      }

      return {
        ...prevCart,
        [vendeurId]: newVendeurCart,
      };
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId, vendeurId, taille, couleur) => {
    setCart(prevCart => {
      const vendeurCart = prevCart[vendeurId] || [];
      const newVendeurCart = vendeurCart.filter(
        item =>
          !(item.id === productId && item.taille === taille && item.couleur === couleur)
      );
      return {
        ...prevCart,
        [vendeurId]: newVendeurCart,
      };
    });
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, vendeurId, quantite, taille, couleur) => {
    if (quantite < 1) return;
    setCart(prevCart => {
      const vendeurCart = prevCart[vendeurId] || [];
      const newVendeurCart = vendeurCart.map(item => {
        if (
          item.id === productId &&
          item.taille === taille &&
          item.couleur === couleur
        ) {
          return { ...item, quantite };
        }
        return item;
      });
      return {
        ...prevCart,
        [vendeurId]: newVendeurCart,
      };
    });
  };

  // Vider le panier d'un vendeur
  const clearCart = (vendeurId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[vendeurId];
      return newCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
