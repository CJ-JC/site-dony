import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-tailwind/react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("Session ID manquant");
        return;
      }

      // Vérifier si l'utilisateur a déjà accédé à la page après paiement
      if (sessionStorage.getItem(`payment_verified_${sessionId}`)) {
        navigate("/user/account");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment/verify?sessionId=${sessionId}`,
        );
        if (response.data.success) {
          setItem(response.data.item);
          setItemType(response.data.item.startDate ? "masterclass" : "course");

          // Marquer le paiement comme vérifié
          sessionStorage.setItem(`payment_verified_${sessionId}`, "true");
        }
      } catch (error) {
        setError("Erreur lors de la vérification du paiement");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  useEffect(() => {
    window.history.replaceState(null, "", "/user/account");
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-blue-600">
            Vérification du paiement en cours...
          </div>
          <div className="animate-spin rounded-full border-b-2 border-blue-600 p-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-red-600">{error}</div>
          <Button color="blue" onClick={() => navigate("/courses")}>
            Retour aux cours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl text-green-500">✓</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Merci pour votre achat. Vous avez maintenant accès à votre{" "}
            {itemType === "masterclass" ? "masterclass" : "cours"}.
          </p>
        </div>

        {item && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            {/* <h2 className="font-semibold text-gray-800">Détails :</h2> */}
            <p className="text-gray-600">{item.title}</p>
            <p className="text-gray-600">{item.price} €</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="gradient"
            onClick={() =>
              navigate(
                itemType === "masterclass"
                  ? `/masterclass/slug/${item.slug}`
                  : `/detail/slug/${item.slug}`,
              )
            }
          >
            Accéder à votre{" "}
            {itemType === "masterclass" ? "masterclass" : "cours"}
          </Button>
          <Button
            color="gray"
            variant="outlined"
            onClick={() =>
              navigate(itemType === "masterclass" ? "/masterclass" : "/courses")
            }
          >
            Voir tous les {itemType === "masterclass" ? "masterclass" : "cours"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
