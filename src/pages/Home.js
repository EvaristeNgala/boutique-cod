// src/pages/Home.jsx
import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <h2>Bienvenue sur <span className="brand">Boutique COD</span> !</h2>
      <p>
        Découvrez nos vêtements, chaussures et accessoires tendances à prix abordables.  
        Commandez en ligne facilement et <strong>payez à la livraison</strong> dans tout le pays.
      </p>
      <ul className="features">
        <li>✔ Livraison rapide à domicile</li>
        <li>✔ Produits de qualité garantie</li>
        <li>✔ Paiement à la réception</li>
      </ul>
      <a href="/shop" className="btn">Voir nos Produits</a>
    </div>
  );
}
