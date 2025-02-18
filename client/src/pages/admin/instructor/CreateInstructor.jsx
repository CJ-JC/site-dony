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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
    name: "",
    biography: "",
    image: null,
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });

    const base64 = await toBase64(file);
    setPreview(URL.createObjectURL(file)); // Pour l'aperçu
    setInputs((prevState) => ({
      ...prevState,
      file: base64,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation des champs
      if (!inputs.name || !inputs.biography || !inputs.file) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      await axios.post(`${BASE_URL}/api/instructor/create`, inputs, {
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
              value={inputs.name}
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
              value={inputs.biography}
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
