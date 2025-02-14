import AlertError from "@/widgets/utils/AlertError";
import Editor from "@/widgets/utils/Editor";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";

const EditMasterclass = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [instructors, setInstructors] = useState([]);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/instructor`);
        const instructors = response.data;
        setInstructors(instructors);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des instructeurs :",
          error,
        );
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/masterclass/${id}`);
        const {
          title,
          description,
          price,
          startDate,
          endDate,
          slug,
          imageUrl,
          duration,
          maxParticipants,
          instructorId,
          link,
        } = response.data;

        setInputs({
          title,
          description,
          price,
          slug,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl,
          duration,
          maxParticipants,
          instructorId,
          link,
        });
        setImageUrl(imageUrl ? `${BASE_URL}${imageUrl}` : null);
      } catch (error) {
        setError("Erreur lors de la récupération de la masterclass");
      }
    };

    fetchMasterclass();
  }, [id]);

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    price: "",
    imageUrl: "",
    duration: "",
    maxParticipants: "",
    slug: "",
    instructorId: null,
    link: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (field, date) => {
    setInputs((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (!inputs.title ||
        !inputs.description ||
        !inputs.price ||
        !inputs.startDate ||
        !inputs.endDate ||
        !inputs.duration ||
        !inputs.maxParticipants ||
        !inputs.slug ||
        !inputs.instructorId,
      !inputs.link)
    ) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      setError("Le prix doit être un nombre valide et supérieur à 0");
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    }

    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("startDate", inputs.startDate.toISOString());
    formData.append("endDate", inputs.endDate.toISOString());
    formData.append("price", inputs.price);
    formData.append("duration", inputs.duration);
    formData.append("maxParticipants", inputs.maxParticipants);
    formData.append("slug", inputs.slug);
    formData.append("instructorId", inputs.instructorId);
    formData.append("link", inputs.link);

    try {
      await axios.put(`${BASE_URL}/api/masterclass/update/${id}`, formData);
      navigate("/administrator/masterclass");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="px-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Mise en place d'une masterclasse
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
                <h2 className="text-xl">Personnalisez votre masterclasse</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  label="Titre de la masterclasse"
                  className="dark:text-white"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-blue-gray-900 dark:text-white"
                >
                  Description de la masterclasse
                </label>
                <Editor
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                  className="dark:text-white"
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
                <h2 className="text-xl">Image de la masterclasse</h2>
              </div>
              <div className="my-6 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
                >
                  Image de la masterclasse
                </label>
                <div className="bg-grey-lighter flex w-full items-center justify-between">
                  <label className="flex w-52 cursor-pointer flex-col items-center justify-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm hover:text-gray-700 dark:text-black">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-center text-sm leading-normal dark:text-black">
                      Sélectionner une image
                    </span>
                    <input
                      type="file"
                      className="hidden"
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
                        alt="Aperçu de la masterclasse"
                        className="mt-2 h-32 w-32 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="my-6 rounded-md border p-4">
                <label
                  htmlFor="instructor"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Instructeur
                </label>
                <select
                  id="instructor"
                  name="instructorId"
                  value={inputs.instructorId || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      instructorId: parseInt(e.target.value),
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-white dark:text-black"
                >
                  <option value="" disabled>
                    -- Sélectionnez un instructeur --
                  </option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
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
                  <h2 className="text-xl">Vendre votre masterclasse</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-blue-gray-900 dark:text-white"
                  >
                    Prix de la masterclasse
                  </label>
                  <Input
                    placeholder="Exemple: Prix de la masterclasse"
                    className="dark:text-white"
                    required
                    name="price"
                    id="price"
                    type="number"
                    value={inputs.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl">Choisissez les dates et heures</h2>
                <div>
                  <label className="text-sm font-medium text-blue-gray-900 dark:text-white">
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
                    className="ml-6 mt-2 w-full rounded-md border border-gray-300 px-2 py-2 dark:text-black"
                  />
                </div>
                <div>
                  <label className="darl:text-white text-sm font-medium text-blue-gray-900 dark:text-white">
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
                    className="ml-6 mt-2 w-full rounded-md border border-gray-300 px-2 py-2 dark:text-black"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-blue-gray-900 dark:text-white"
                >
                  Durer de la masterclasse (en heures)
                </label>
                <Input
                  placeholder="Exemple: 2"
                  required
                  name="duration"
                  id="duration"
                  type="number"
                  className="dark:text-white"
                  value={inputs.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="maxParticipants"
                  className="text-sm font-medium text-blue-gray-900 dark:text-white"
                >
                  Maximum de participants
                </label>
                <Input
                  placeholder="Exemple: 20"
                  required
                  className="dark:text-white"
                  name="maxParticipants"
                  id="maxParticipants"
                  type="number"
                  value={inputs.maxParticipants}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="link"
                  className="text-sm font-medium text-blue-gray-900 dark:text-white"
                >
                  Lien de la masterclass
                </label>
                <Input
                  placeholder="Exemple: 20"
                  required
                  className="dark:text-white"
                  name="link"
                  id="link"
                  value={inputs.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400"
              onClick={handleSubmit}
            >
              Modifier la masterclasse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMasterclass;
