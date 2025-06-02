import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  IconButton,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import Loading from "@/widgets/utils/Loading";
import { Edit } from "lucide-react";

const AccountAdmin = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordCurrent: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/user/profile/${user.id}`,
        );
        setUserData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          passwordCurrent: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Erreur:", error);
        setMessage({
          type: "error",
          content:
            error.response?.data?.message ||
            "Erreur lors de la récupération des données",
        });
      }
    };

    if (isLoggedIn && !authLoading) {
      fetchUserData();
    }
  }, [authLoading, isLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        content: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/user/${user.id}`,
        formData,
      );
      setUserData(response.data);
      setMessage({
        type: "success",
        content: "Profil mis à jour avec succès",
      });
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setMessage({
        type: "error",
        content:
          error.response?.data?.message || "Erreur lors de la mise à jour",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (authLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl border p-6 dark:bg-[#25303F]">
        <div className="mb-6 flex items-center justify-between">
          <Typography
            variant="h4"
            color="blue-gray"
            className="dark:text-white"
          >
            Mon Profil
          </Typography>
          <IconButton variant="text" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-5 w-5 dark:text-white" />
          </IconButton>
        </div>

        {message.content && (
          <Alert
            color={message.type === "success" ? "green" : "red"}
            className="mb-4"
          >
            {message.content}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium dark:text-white"
            >
              Prénom
            </Typography>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              className={
                !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
              }
            />
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium dark:text-white"
            >
              Nom
            </Typography>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              className={
                !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
              }
            />
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium dark:text-white"
            >
              Email
            </Typography>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              className={
                !isEditing ? "bg-gray-50 dark:text-white" : "dark:text-white"
              }
            />
          </div>

          {isEditing && (
            <>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium dark:text-white"
                >
                  Mot de passe actuel
                </Typography>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="passwordCurrent"
                  value={formData.passwordCurrent || ""}
                  onChange={handleChange}
                  placeholder="Mot de passe actuel"
                  className="dark:text-white"
                />
              </div>
              <div className="relative">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium dark:text-white"
                >
                  Nouveau mot de passe
                </Typography>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nouveau mot de passe"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="pr-10 dark:text-white"
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
                  className="mb-2 font-medium dark:text-white"
                >
                  Confirmer le mot de passe
                </Typography>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {isEditing && (
            <Button type="submit" className="mt-6" fullWidth>
              Mettre à jour le profil
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
};

export default AccountAdmin;
