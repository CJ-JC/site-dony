import axios from "axios";

// Fonction pour gérer le paiement
export const handleCheckout = async ({
  course,
  masterclass,
  isLoggedIn,
  navigate,
  setError,
  discountedPrice,
}) => {
  if (!isLoggedIn) {
    navigate("/sign-in");
    return;
  }

  try {
    // Déterminer le type de produit
    const isMasterclass = !!masterclass;
    const BASE_URL = import.meta.env.VITE_API_URL;
    const finalPrice = isMasterclass ? masterclass.price : discountedPrice;

    // Créer la session de paiement
    const response = await axios.post(
      `${BASE_URL}/api/payment/create-checkout-session`,
      isMasterclass
        ? {
            masterclassId: masterclass.id,
            masterclassName: masterclass.title,
            masterclassPrice: Math.round(finalPrice * 100),
            masterclassImageUrl: masterclass.imageUrl,
            masterclassSlug: masterclass.slug,
          }
        : {
            courseId: course.id,
            courseName: course.title,
            coursePrice: Math.round(finalPrice * 100),
            courseImageUrl: course.imageUrl,
            courseSlug: course.slug,
          },
    );

    // Vérifier que nous avons bien reçu l'ID de session
    if (!response.data || !response.data.id) {
      throw new Error("Pas d'ID de session reçu du serveur");
    }

    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    setError("Réponse du serveur en cas d'erreur:", error.response?.data);
  }
};
