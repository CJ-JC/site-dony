import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import AlertError from "@/widgets/utils/AlertError";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category`);
        setCategories(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des catégories");
      }
    };
    fetchCategories();
  }, []);

  const [inputs, setInputs] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    videoUrl: "",
    categoryId: "",
    file: null,
  });

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
    setImageUrl(URL.createObjectURL(file)); // Pour l'aperçu
    setInputs((prevState) => ({
      ...prevState,
      file: base64,
    }));
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/course/create`,
        inputs,
      );

      const newCourseId = response.data.result.id;

      navigate(`/administrator/edit-course/${newCourseId}`);

      setInputs({
        title: "",
        slug: "",
        description: "",
        price: "",
        videoUrl: "",
        categoryId: "",
      });
      setFile(null);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="px-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Mise en place de la formation
        </h2>
        <AlertError error={error} />
        <form onSubmit={handleSubmit}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-dashboard h-8 w-8 text-green-700"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                  </svg>
                </div>
                <h2 className="text-xl">Personnalisez votre formation</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  label="Titre de la formation"
                  className="dark:text-white dark:focus:border-white"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description de la formation
                </label>
                <Editor
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                />{" "}
              </div>
              <div className="my-6 flex items-center gap-x-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image text-green-500"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h2 className="text-xl">Image de la formation</h2>
              </div>
              <div className="my-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image de la formation
                </label>
                <div className="bg-grey-lighter flex w-full items-center justify-between">
                  <label className="flex w-52 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm hover:text-gray-700 dark:text-black">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-sm leading-normal">
                      Sélectionner une image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imageUrl && (
                    <div className="mb-4">
                      <img
                        src={
                          imageUrl.startsWith("blob:")
                            ? imageUrl
                            : `${imageUrl}`
                        }
                        alt="Aperçu du cours"
                        className="mt-2 h-32 w-32 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-dollar-sign h-8 w-8 text-green-700"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                    <path d="M12 18V6"></path>
                  </svg>
                </div>
                <h2 className="text-xl">Vendre votre formation</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-900"
                >
                  Prix de la formation
                </label>
                <Input
                  placeholder="Exemple: Prix de la formation"
                  required
                  name="price"
                  id="price"
                  type="number"
                  value={inputs.price}
                  onChange={handleChange}
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-list-checks h-8 w-8 text-green-700"
                    >
                      <path d="m3 17 2 2 4-4"></path>
                      <path d="m3 7 2 2 4-4"></path>
                      <path d="M13 6h8"></path>
                      <path d="M13 12h8"></path>
                      <path d="M13 18h8"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl">Chapitres de la formation</h2>
                </div>
                <div className="my-6 space-y-2 rounded-md border p-4">
                  <div className="flex items-center justify-between font-medium">
                    <label
                      htmlFor="chapterTitle"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Chapitre de la formation
                    </label>
                    <button
                      size="sm"
                      className="flex cursor-not-allowed items-center rounded-md p-2 text-gray-400"
                      disabled
                      title="Créez d'abord le cours pour ajouter des chapitres"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter chapitre
                    </button>
                  </div>
                  <p className="text-sm italic text-gray-600 dark:text-white">
                    Créez d'abord le cours pour ajouter des chapitres
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-video text-green-500"
                    >
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                      <rect x="2" y="6" width="14" height="12" rx="2" />
                    </svg>
                  </div>
                  <h2 className="text-xl">Vidéo aperçu de la formation</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <Input
                    label="Vidéo aperçu de la formation"
                    required
                    name="videoUrl"
                    id="videoUrl"
                    type="text"
                    value={inputs.videoUrl}
                    onChange={handleChange}
                    className="dark:text-white dark:focus:border-white"
                  />
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Catégorie du cours
                  </label>
                  <select
                    id="category"
                    name="categoryId"
                    value={inputs.categoryId || ""}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        categoryId: parseInt(e.target.value),
                      }))
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:bg-white dark:text-black dark:placeholder-gray-400"
                  >
                    <option value="" disabled>
                      -- Sélectionnez une catégorie --
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer le cours"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
