// Importation des modules Firebase nécessaires
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuration Firebase (tes clés)
const firebaseConfig = {
  apiKey: "AIzaSyACNAQy-lDMLxcF4lY94nXZaP3vYOqkBQI",
  authDomain: "mon-ecommerce-74ab1.firebaseapp.com",
  projectId: "mon-ecommerce-74ab1",
  storageBucket: "mon-ecommerce-74ab1.appspot.com", // ✅ corrigé
  messagingSenderId: "64302986040",
  appId: "1:64302986040:web:2fe58ee1bbc30a9f9ac7cd",
  measurementId: "G-07FVBS7MZD"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialisation des services utilisés
export const db = getFirestore(app);     // 🔥 Base de données
export const auth = getAuth(app);        // 🔥 Authentification
export const storage = getStorage(app);  // 🔥 Stockage d’images

export default app;
