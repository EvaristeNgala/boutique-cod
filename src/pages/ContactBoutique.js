import React, { useState } from "react";

export default function ContactBoutique() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.nom || !formData.email || !formData.message) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    // Pour l’instant juste afficher les infos en alerte
    alert(`Message envoyé !\nNom : ${formData.nom}\nEmail : ${formData.email}\nMessage : ${formData.message}`);

    // Ici tu pourrais connecter avec backend ou Firebase pour stocker/envoi email

    setFormData({ nom: "", email: "", message: "" });
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, boxShadow: "0 0 8px rgba(0,0,0,0.1)", borderRadius: 8 }}>
      <h2>Contactez-nous</h2>
      <p>Vous avez une question ? Envoyez-nous un message, nous vous répondrons rapidement.</p>

      {submitted && <p style={{ color: "green" }}>Merci pour votre message ! Nous vous contacterons bientôt.</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <label>
          Nom complet :
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            style={{ width: "95%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Adresse email :
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "95%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Message :
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            style={{ width: "95%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0a1f44",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
