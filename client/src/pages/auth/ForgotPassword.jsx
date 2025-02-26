import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/reset-password/forgot-password`,
        {
          email,
        },
      );

      setMessage({ text: response.data, isError: false }); // Message succès
      setEmail(""); // Réinitialiser l'email
    } catch (error) {
      setMessage({
        text:
          error.response?.data ||
          "Une erreur s'est produite. Veuillez réessayer.",
        isError: true, // Indicateur d'erreur
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Mot de Passe Oublié
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        {message && (
          <div
            className={`mb-6 rounded-md p-4 text-sm ${
              message.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="email"
              label="Adresse e-mail"
              type="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className=" bg-gray-50 p-2 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-white dark:text-white dark:placeholder-gray-100"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            disabled={isSubmitting}
            className={`w-full rounded-lg px-4 py-2 text-white focus:outline-none ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer un lien"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-white">
          <Link
            to={"/sign-in"}
            className="text-blue-gray-800 hover:underline dark:text-white"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
