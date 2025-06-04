import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const BASE_URL = import.meta.env.VITE_API_URL;

  if (!token) {
    window.location.href = "/";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/reset-password/change-password`,
        {
          newPassword: password,
          confirmPassword,
          token,
        },
      );

      if (response.status === 200) {
        setMessage("Votre mot de passe a été changé avec succès.");
        setMessageType("success");
        setPassword("");
        setConfirmPassword("");
      } else {
        throw new Error("Une erreur s'est produite.");
      }
    } catch (error) {
      setMessage(error.response.data?.error);
      setMessageType("error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Changer le Mot de Passe
        </h2>

        {message && (
          <div
            className={`mb-4 rounded-md p-4 text-sm ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Nouveau Mot de Passe"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Confirmer le Mot de Passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="w-full rounded-lg bg-blue-500 py-2 text-white shadow-md hover:bg-blue-600 dark:bg-blue-700"
          >
            Changer le Mot de Passe
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-white">
          <Link
            to={"/sign-in"}
            className="text-gray-800 hover:underline dark:text-white"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
