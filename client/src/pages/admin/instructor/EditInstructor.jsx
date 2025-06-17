import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Textarea,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

export default function EditInstructor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const [inputs, setInputs] = useState({
    name: "",
    biography: "",
    image: null,
    file: null,
  });

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/instructor/${id}`);
        const instructor = response.data;
        setInputs({
          name: instructor.name || "",
          biography: instructor.biography || "",
          image: null,
          file: null,
        });
        setCurrentImage(`${CoursesImage}${instructor.imageUrl}`);
      } catch (err) {
        setError("Erreur lors de la récupération des données de l'instructeur");
      }
    };

    fetchInstructor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      if (!inputs.name || !inputs.biography) {
        setError("Nom et biographie sont obligatoires");
        return;
      }

      if (!inputs.file && !currentImage) {
        setError("Veuillez ajouter une image");
        return;
      }

      await axios.put(`${BASE_URL}/api/instructor/update/${id}`, inputs, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/administrator/instructors");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la modification",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-3xl border p-6 dark:bg-transparent">
        <Typography variant="h4" color="blue-gray" className="dark:text-white">
          Modifier l'instructeur
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
              className="bg-gray-50 dark:text-white"
              placeholder="Nom de l'instructeur"
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
            <Editor
              name="biography"
              value={inputs.biography}
              onChange={handleChange}
              className="dark:text-white"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 dark:text-white"
            >
              Photo
            </Typography>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {preview ? (
              <img
                src={preview}
                alt="Aperçu"
                className="mt-2 max-w-xs rounded-lg shadow-lg"
              />
            ) : (
              currentImage && (
                <img
                  src={`${currentImage}`}
                  alt="Image actuelle"
                  className="mt-2 max-w-xs rounded-lg shadow-lg"
                />
              )
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outlined"
              onClick={() => navigate("/administrator/instructors")}
              className="dark:bg-white dark:text-black"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} variant="gradient">
              {loading ? "Modification en cours..." : "Modifier l'instructeur"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
