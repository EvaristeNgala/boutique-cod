import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACNAQy-lDMLxcF4lY94nXZaP3vYOqkBQI",
  authDomain: "mon-ecommerce-74ab1.firebaseapp.com",
  projectId: "mon-ecommerce-74ab1",
  storageBucket: "mon-ecommerce-74ab1.appspot.com",
  messagingSenderId: "64302986040",
  appId: "1:64302986040:web:2fe58ee1bbc30a9f9ac7cd",
  measurementId: "G-07FVBS7MZD",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// ✅ Fonction pour demander la permission et obtenir le token FCM
export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "BPh8vdDXxHVYO48s779wpbIBY3I-OFvoNVDqJ6UK2WSDFhCKhLdAMHZ2VsXk5w_v0inK_SpyNZf4F6BnRndcbDA" });
    if (token) {
      console.log("✅ Token FCM :", token);
      return token;
    } else {
      console.warn("❌ Permission de notification refusée.");
    }
  } catch (error) {
    console.error("🔥 Erreur lors de la récupération du token FCM :", error);
  }
};
