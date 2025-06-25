import AlertError from "@/widgets/utils/AlertError";
import Editor from "@/widgets/utils/Editor";
import PublishButton from "@/widgets/utils/PublishButton";
import { Input } from "@material-tailwind/react";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import Select from "react-select";

const EditMasterclass = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);

  const [masterclass, setMasterclasses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category`);

        const categoryOptions = response.data.map((category) => ({
          value: category.id,
          label: category.title,
        }));
        setCategoryOptions(categoryOptions);
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

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios(`${BASE_URL}/api/masterclass/${id}`);
        const {
          title,
          description,
          price,
          startDate,
          endDate,
          slug,
          imageUrl,
          duration,
          isPublished,
          maxParticipants,
          instructorId,
          categoryId,
          link,
        } = response.data;
        const now = new Date();
        setInputs({
          title,
          description,
          price,
          slug,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl,
          duration,
          isPublished: new Date(endDate) < now ? false : isPublished,
          maxParticipants,
          instructorId,
          categoryId,
          link,
        });
        setImageUrl(`${CoursesImage}${imageUrl}`);
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
    categoryId: null,
    isPublished: false,
    slug: "",
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

  const handleInstructorChange = (selectedOption) => {
    setInputs((prev) => ({
      ...prev,
      instructorId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setInputs((prev) => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/masterclass/delete/${id}`);
      setDeleteDialog(false);
      navigate("/administrator/masterclass");
    } catch (err) {
      setError("Erreur lors de la suppression de l'instructeur");
    }
  };

  const openDeleteDialog = (inputs) => {
    setSelectedMasterclass(inputs);
    setDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      setError("Le prix doit être un nombre valide et supérieur à 0");
      return;
    }

    const now = new Date();
    const isExpired = new Date(inputs.endDate) < now;

    if (isExpired) {
      setError(
        "La date de fin est dépassée. Vous ne pouvez pas publier cette formation.",
      );
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/masterclass/update/${id}`, inputs);
      navigate("/administrator/masterclass");
    } catch (error) {
      setError(error.response?.data.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (masterclassId, newStatus) => {
    setMasterclasses((prevMasterclass) =>
      prevMasterclass.map((masterclass) =>
        masterclass.id === masterclassId
          ? { ...masterclass, isPublished: newStatus }
          : masterclass,
      ),
    );
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
    <>
      {inputs.isPublished === false && (
        <div className="border-yellow-30 text-primary flex w-full items-center border bg-yellow-200/80 p-4 text-sm dark:bg-white/90 dark:text-black">
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
            className="lucide lucide-triangle-alert mr-2 h-4 w-4"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
          Cette formation n'est pas publiée. Elle ne sera pas visible pour les
          élèves.
        </div>
      )}
      <div className="py-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h1 className="text-xl font-medium md:text-2xl">
            Mise en place de la formation
          </h1>
          <div className="flex items-center gap-x-2">
            <PublishButton
              inputs={inputs}
              masterclassId={id}
              isPublished={inputs.isPublished}
              onStatusChange={(newStatus) =>
                handleStatusChange(masterclass.id, newStatus)
              }
            />
            <button
              className="rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-800"
              title="Supprimer la formation"
              type="button"
              onClick={() => openDeleteDialog(id)}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
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
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900 dark:text-white"
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
                  className="-mb-3 text-sm font-medium text-gray-900 dark:text-white"
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
                      accept="image/*"
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
                        className="mt-2 h-32 w-40 rounded"
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
                  placeholder="Sélectionnez un instructeur"
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
                  <h2 className="text-xl">Vendre votre masterclasse</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-900 dark:text-white"
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
                    className="text-black dark:text-white"
                    styles={customStyles}
                  />
                </div>
              </div>

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
                      className="mb-4 w-full rounded-md border border-gray-300 px-2 py-2 dark:text-black"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-x-2">
                    <label className="darl:text-white text-sm font-medium text-gray-900 dark:text-white">
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
                      className="mb-4 mr-4 w-full rounded-md border border-gray-300 p-6 px-2 py-2 dark:text-black"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-900 dark:text-white"
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
                  className="text-sm font-medium text-gray-900 dark:text-white"
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
                  className="text-sm font-medium text-gray-900 dark:text-white"
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
              className="mt-6"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Modification en cours..."
                : "Modifier la masterclasse"}
            </Button>
          </div>
        </form>

        <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
          <DialogHeader>Confirmer la suppression</DialogHeader>
          <DialogBody>
            Êtes-vous sûr de vouloir supprimer la masterclasse{" "}
            {masterclass.title} ? Cette action est irréversible.
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={() => setDeleteDialog(false)}
              className="mr-1"
            >
              Annuler
            </Button>
            <Button variant="gradient" color="red" onClick={handleDelete}>
              Confirmer
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
};

export default EditMasterclass;
