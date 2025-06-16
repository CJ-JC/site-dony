import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-tailwind/react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [masterclass, setMasterclass] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setError("Session ID manquant");
        return;
      }

      // Évite la double vérification
      if (sessionStorage.getItem(`payment_verified_${sessionId}`)) {
        navigate("/user/account");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment/verify?sessionId=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );

        if (response.data.success) {
          setMasterclass(response.data);
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
    // Nettoie l'URL
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
          <Button
            color="gray"
            variant="outlined"
            onClick={() => navigate("/masterclass")}
          >
            Retour aux masterclass
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl text-green-500">✓</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Merci pour votre achat. Vous avez maintenant accès à votre
            masterclass.
          </p>
        </div>

        {masterclass && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="font-semibold text-gray-800">
              {masterclass.masterclass?.title}
            </p>
            <p className="text-gray-600">{masterclass.masterclass?.price} €</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="gradient"
            onClick={() =>
              navigate(`/masterclass/slug/${masterclass.masterclass?.slug}`)
            }
          >
            Accéder à la masterclass
          </Button>
          <Button
            color="gray"
            variant="outlined"
            onClick={() => navigate("/masterclass")}
          >
            Voir toutes les masterclass
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
