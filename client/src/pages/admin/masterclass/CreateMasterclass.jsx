import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import AlertError from "@/widgets/utils/AlertError";
import { useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import Select from "react-select";

registerLocale("fr", fr);

const CreateMasterclass = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category`);
        const options = response.data.map((category) => ({
          value: category.id,
          label: category.title,
        }));
        setCategories(response.data); // pour autre usage si besoin
        setCategoryOptions(options); // ⬅️ nouvelle variable d'état
      } catch (error) {
        setError("Erreur lors de la récupération des catégories");
      }
    };
    fetchCategories();
  }, []);

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

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/instructor`);
        const instructors = response.data;
        setInstructors(instructors);
        const instructorOptions = instructors.map((instructor) => ({
          value: instructor.id,
          label: instructor.name,
        }));
        setInstructorOptions(instructorOptions);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des instructeurs :",
          error,
        );
      }
    };

    fetchInstructors();
  }, []);

  const [inputs, setInputs] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    duration: "",
    maxParticipants: "",
    imageUrl: "",
    startDate: new Date(),
    endDate: new Date(),
    instructorId: null,
    link: "",
    file: null,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (field, date) => {
    setInputs((prev) => ({ ...prev, [field]: date }));
  };

  const handleCategoryChange = (selectedOption) => {
    setInputs((prev) => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleInstructorChange = (selectedOption) => {
    setInputs((prev) => ({
      ...prev,
      instructorId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      setError("Le prix doit être un nombre valide et supérieur à 0");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/masterclass/create`,
        inputs,
      );

      const newMasterclass = response.data;
      navigate(`/administrator/edit-masterclass/${newMasterclass.id}`);
    } catch (error) {
      setError(error.response?.data.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: "#B0BEC5",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: "#B0BEC5",
      },
      backgroundColor: "transparent",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "gray",
    }),
    placeholder: (base) => ({
      ...base,
      color: "gray",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
    }),
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="px-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Mise en place d'une masterclass
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
                <h2 className="text-xl">Personnalisez votre masterclass</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  label="Titre de la masterclass"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description de la masterclass
                </label>
                <Editor
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                />
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
                <h2 className="text-xl">Image de la masterclass</h2>
              </div>
              <div className="my-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image de la masterclass
                </label>
                <div className="bg-grey-lighter flex w-full items-center justify-between">
                  <label className="flex w-52 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm dark:bg-gray-400 dark:text-gray-700">
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
                      accept="image/*"
                      id="image"
                      name="image"
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
                        className="mt-2 h-32 w-40 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="my-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="instructor"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Instructeur
                </label>
                <Select
                  id="instructor"
                  options={instructorOptions}
                  onChange={handleInstructorChange}
                  value={
                    inputs.instructorId
                      ? instructorOptions.find(
                          (opt) => opt.value === inputs.instructorId,
                        )
                      : null
                  }
                  placeholder="Sélectionner un instructeur"
                  isClearable
                  className="text-black dark:text-white"
                  styles={customStyles}
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
                      className="lucide lucide-circle-dollar-sign h-8 w-8 text-green-700"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                      <path d="M12 18V6"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl">Vendre votre masterclass</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Prix de la masterclass
                  </label>
                  <Input
                    placeholder="Exemple: Prix de la masterclass"
                    required
                    name="price"
                    id="price"
                    type="number"
                    value={inputs.price}
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

                  <Select
                    id="category"
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={
                      inputs.categoryId
                        ? categoryOptions.find(
                            (opt) => opt.value === inputs.categoryId,
                          )
                        : null
                    }
                    placeholder="Sélectionner une catégorie"
                    isClearable
                    styles={customStyles}
                  />
                </div>
              </div>

              {/* Date and Time Selector */}
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
                      className="lucide lucide-clock-icon lucide-clock h-8 w-8 text-green-700"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h2 className="text-xl">Choisissez les dates et heures</h2>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-x-2 md:grid-cols-2">
                  <div className="flex flex-col items-start gap-x-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Date et heure de début
                    </label>
                    <DatePicker
                      selected={inputs.startDate}
                      onChange={(date) => handleDateChange("startDate", date)}
                      dateFormat="dd MMMM yyyy, HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      locale="fr"
                      className="mb-4 w-full rounded-md border border-gray-300 px-2 py-2 dark:bg-gray-400 dark:text-black"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-x-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Date et heure de fin
                    </label>
                    <DatePicker
                      selected={inputs.endDate}
                      onChange={(date) => handleDateChange("endDate", date)}
                      dateFormat="dd MMMM yyyy, HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      locale="fr"
                      className="mb-4 mr-4 w-full rounded-md border border-gray-300 px-2 py-2 dark:bg-gray-400 dark:text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Durer de la masterclass (en heures)
                </label>
                <Input
                  placeholder="Exemple: 2"
                  required
                  name="duration"
                  id="duration"
                  type="number"
                  value={inputs.duration}
                  onChange={handleChange}
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="maxParticipants"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Maximum de participants
                </label>
                <Input
                  placeholder="Exemple: 20"
                  required
                  name="maxParticipants"
                  id="maxParticipants"
                  type="number"
                  value={inputs.maxParticipants}
                  onChange={handleChange}
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="link"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Lien de la masterclass
                </label>
                <Input
                  placeholder="Lien de la masterclass"
                  required
                  name="link"
                  id="link"
                  value={inputs.link}
                  onChange={handleChange}
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="mt-6" disabled={loading}>
              {loading ? "Création en cours..." : "Créer le cours"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMasterclass;
