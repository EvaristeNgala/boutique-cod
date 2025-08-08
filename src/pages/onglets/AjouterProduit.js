import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

export default function AjouterProduit() {
  const [nom, setNom] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categorie, setCategorie] = useState('');
  const [tailles, setTailles] = useState('');
  const [couleurs, setCouleurs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Vous devez être connecté pour ajouter un produit.');
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'produits'), {
        nom,
        price: parseFloat(price),
        description,
        categorie,
        tailles: tailles.split(',').map(t => t.trim()),
        couleurs: couleurs.split(',').map(c => c.trim()),
        image: imageUrl,
        vendeurId: user.uid,
        createdAt: serverTimestamp()
      });

      alert('Produit ajouté avec succès');
      setNom('');
      setPrice('');
      setDescription('');
      setCategorie('');
      setTailles('');
      setCouleurs('');
      setImageUrl('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout :', error);
      alert('Erreur lors de l\'ajout du produit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter un produit</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ ...inputStyle, height: '100px' }}
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Tailles (séparées par des virgules)"
          value={tailles}
          onChange={(e) => setTailles(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Couleurs (séparées par des virgules)"
          value={couleurs}
          onChange={(e) => setCouleurs(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Lien URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>

      {imageUrl && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Aperçu de l'image :</p>
          <img src={imageUrl} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '16px',
  width: '100%'
};
