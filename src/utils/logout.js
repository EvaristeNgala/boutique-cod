// ✅ src/utils/logout.js
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const logoutUser = async (navigate, vendeurId = null) => {
  try {
    await signOut(auth); // ✅ Déconnecte complètement l'utilisateur
    localStorage.clear(); // ✅ Efface tout stockage local lié au compte
    sessionStorage.clear();

    alert("✅ Vous avez été déconnecté.");
    // 🔹 Si on est dans une boutique, retour à la page boutique
    if (vendeurId) {
      navigate(`/boutique/${vendeurId}`);
    } else {
      navigate("/"); // 🔹 Sinon retour à l'accueil
    }
  } catch (error) {
    alert("❌ Erreur lors de la déconnexion : " + error.message);
  }
};
