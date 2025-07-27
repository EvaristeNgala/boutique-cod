import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AjouterProduit() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    categorie: ""
  });
  const navigate = useNavigate();

  // ✅ Vérifie si un vendeur est connecté
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Envoi vers Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("❌ Vous devez être connecté pour ajouter un produit !");
      return;
    }

    try {
      await addDoc(collection(db, "produits"), {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        stock: parseInt(formData.stock),
        categorie: formData.categorie,
        vendeurId: user.uid,
        createdAt: serverTimestamp()
      });

      alert("✅ Produit ajouté avec succès !");
      setFormData({ name: "", price: "", description: "", image: "", stock: "", categorie: "" });
      navigate("/dashboard-vendeur");
    } catch (error) {
      alert("❌ Erreur : " + error.message);
    }
  };

  // ✅ Styles modernes
  const container = {
    maxWidth: "500px",
    margin: "40px auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  };

  const title = { textAlign: "center", marginBottom: "15px", color: "#222" };
  const input = { width: "100%", padding: "12px", margin: "8px 0", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem" };
  const textarea = { ...input, minHeight: "80px", resize: "vertical" };
  const btn = { width: "100%", padding: "12px", background: "#222", color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold", marginTop: "10px", transition: "0.3s" };
  

  return (
    <div style={container}>
      <h2 style={title}>🛍️ Ajouter un nouveau produit</h2>
      <form onSubmit={handleSubmit}>
        <input style={input} type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required />
        <input style={input} type="number" name="price" placeholder="Prix (en $)" value={formData.price} onChange={handleChange} required />
        <textarea style={textarea} name="description" placeholder="Description du produit" value={formData.description} onChange={handleChange} required />
        <input style={input} type="text" name="image" placeholder="URL de l’image" value={formData.image} onChange={handleChange} required />
        <input style={input} type="number" name="stock" placeholder="Quantité en stock" value={formData.stock} onChange={handleChange} required />
        <input style={input} type="text" name="categorie" placeholder="Catégorie (ex: vêtements, électronique...)" value={formData.categorie} onChange={handleChange} />

        <button
          style={btn}
          onMouseOver={(e) => (e.target.style.background = "#ff9800")}
          onMouseOut={(e) => (e.target.style.background = "#222")}
          type="submit"
        >
          ✅ Ajouter le produit
        </button>
      </form>
    </div>
  );
}
