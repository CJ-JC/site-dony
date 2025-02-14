import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Textarea,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function CreateInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("biography", formData.biography);
      if (formData.image) {
        formDataToSend.append("images", formData.image);
      }

      await axios.post(`${BASE_URL}/api/instructor/create`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/administrator/instructors");
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-3xl p-6 dark:bg-[#25303F]">
        <Typography variant="h4" color="blue-gray" className="dark:text-white">
          Créer un nouvel instructeur
        </Typography>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 dark:text-white"
            >
              Nom
            </Typography>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Nom de l'instructeur"
              className="bg-gray-50 dark:text-white"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 dark:text-white"
            >
              Biographie
            </Typography>
            <Textarea
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              required
              placeholder="Biographie de l'instructeur"
              className="bg-gray-50 dark:text-white"
              rows={6}
            />
          </div>

          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Photo
            </Typography>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Aperçu"
                className="mt-2 max-w-xs rounded-lg shadow-lg"
              />
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outlined"
              onClick={() => navigate("/administrator/instructors")}
              className="dark:bg-white dark:text-black"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} variant="gradient">
              {loading ? "Création en cours..." : "Créer l'instructeur"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
