import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Input,
  Typography,
} from "@material-tailwind/react";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { CheckCircle, EyeIcon } from "lucide-react";

const Settings = ({
  formData,
  handleChange,
  passwordMessage,
  handlePasswordSubmit,
  togglePasswordVisibility,
  showPassword,
}) => {
  return (
    <div className="container mx-auto h-auto md:h-screen">
      <Typography variant="h4" className="dark:text-white">
        Vos paramètres
      </Typography>
      <p className="text-gray-600 dark:text-white">
        Changez votre mot de passe ou laissez vide pour garder votre mot de
        passe actuel.
      </p>

      <div className="mx-auto my-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 dark:bg-white/90">
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h4" color="blue-gray">
              Mot de passe
            </Typography>
          </div>

          {passwordMessage?.content && (
            <Alert
              color={passwordMessage.type === "success" ? "green" : "red"}
              className="mb-4"
            >
              {passwordMessage.content}
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Mot de passe actuel
              </Typography>
              <Input
                type={showPassword ? "text" : "password"}
                name="passwordCurrent"
                value={formData.passwordCurrent || ""}
                onChange={handleChange}
                placeholder="Mot de passe actuel"
              />
            </div>

            <div className="relative">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Nouveau mot de passe
              </Typography>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="pr-10"
                placeholder="Nouveau mot de passe"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-9 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Confirmer le mot de passe
              </Typography>
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
              />
            </div>

            <Button type="submit" className="mt-6" fullWidth>
              Mettre à jour le profil
            </Button>
          </form>
        </Card>
        <div className="h-min rounded-lg bg-[#F9FAFB] p-4 dark:bg-white/90">
          <div>
            <Typography variant="h6" className="text-sm font-medium">
              Exigences en matière de mot de passe :
            </Typography>
          </div>
          <div>
            <Typography variant="h6" className="text-sm font-medium">
              Veillez à ce que les conditions suivantes soient remplies :
            </Typography>
          </div>
          <div className="my-3 text-sm">
            <ul className="space-y-2 font-normal">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Au moins 8 caractères
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Au moins un caractère minuscule
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Au moins un caractère majuscule
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Inclusion d'au moins un caractère spécial, par exemple, (! @ #
                ?)
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                être significativement différent de vos mots de passe précédents
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
