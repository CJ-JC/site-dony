import Loading from "@/widgets/utils/Loading";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/user/${id}/profile`);
        setUserData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/administrator/users");
        } else {
          setError("Impossible de charger les informations de l'utilisateur.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  const handleDeletePurchase = async (purchaseId) => {
    try {
      await axios.delete(`${BASE_URL}/api/user/purchase/${purchaseId}`);
      const updatedPurchases = userData.purchases.filter(
        (p) => p.id !== purchaseId,
      );
      setUserData({ ...userData, purchases: updatedPurchases });
    } catch (err) {
      setError("Erreur lors de la suppression de l'achat.");
    }
  };

  if (!id) {
    return navigate("/administrator/users");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border shadow-md dark:bg-[#25303F]">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Profil de {userData?.firstName} {userData?.lastName}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Informations détaillées sur l'utilisateur et ses achats.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-3 text-gray-700 dark:text-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm font-medium">Nom</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              {userData?.lastName}
            </dd>
          </div>
          <div className="py-3 text-gray-700 dark:text-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm font-medium">Prénom</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              {userData?.firstName}
            </dd>
          </div>
          <div className="py-3 text-gray-700 dark:text-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm font-medium">Email address</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              {userData?.email}
            </dd>
          </div>
          <div className="py-3 text-gray-700 dark:text-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm font-medium">Rôle</dt>
            <dd className="mt-1 text-sm  sm:col-span-2 sm:mt-0">
              {userData?.role === "admin"
                ? "Administrateur"
                : userData?.role === "user"
                ? "Client"
                : "Inconnu"}
            </dd>
          </div>
          <div className="py-3 text-gray-700 dark:text-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm font-medium ">Formations souscrites :</dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <div>
                <ul className="mt-1 max-h-32 list-disc overflow-auto">
                  {userData?.purchases && userData.purchases.length > 0 ? (
                    userData.purchases?.map((purchase) => (
                      <li key={purchase.id} className="mb-2 border p-1">
                        <div className="flex items-center justify-between">
                          <div>
                            {purchase.itemType === "course" && (
                              <>
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                                  Cours
                                </span>{" "}
                                {purchase.course?.title}
                              </>
                            )}
                            {purchase.itemType === "masterclass" && (
                              <>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-700/10">
                                  Masterclass
                                </span>{" "}
                                {purchase.masterclass?.title}
                              </>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="gradient"
                            color="red"
                            onClick={() => setOpen(true)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-700">
                      Aucun achat trouvé pour cet utilisateur.
                    </li>
                  )}
                </ul>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      {/* Popup infos utilisateur */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-400">
            <p className="text-center text-red-700">
              Attention, cette action est irréversible.
            </p>
            <div
              className="rounded-lg p-4 text-center text-sm text-red-600"
              role="alert"
            >
              <svg
                className="inline h-8 w-8 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div className="mt-2 text-center text-gray-700">
                Cette action supprimera définitivement l'achat de l'utilisateur
                et l'empêchera d'accéder au contenu associé.
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <Button
                variant="gradient"
                color="red"
                size="sm"
                onClick={() => handleDeletePurchase(userData.id)}
              >
                Supprimer les achats
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => setOpen(false)}
                className="dark:text-dark dark:bg-white dark:hover:bg-gray-200"
                title="Fermer la fenêtre"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
