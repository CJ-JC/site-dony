import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertError from "@/widgets/utils/AlertError";
import { Pen, PlusCircle, TrashIcon } from "lucide-react";
import Vimeo from "@u-wave/react-vimeo";
import axios from "axios";
import PublishButton from "@/widgets/utils/PublishButton";
import Editor from "@/widgets/utils/Editor";
import Modal from "@/widgets/utils/Modal";

const editCourse = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const { id } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/course/get-course-by-id/${id}`,
        );
        const {
          title,
          description,
          price,
          videoUrl,
          imageUrl,
          slug,
          chapters,
          isPublished,
          categoryId,
        } = response.data;

        setInputs({
          title,
          description,
          price,
          videoUrl,
          slug,
          chapters,
          isPublished,
          categoryId,
        });

        setImageUrl(`${CoursesImage}${imageUrl}`);
        setVideoUrl(videoUrl ? `${videoUrl}` : null);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/administrator/courses");
        }
        setError("Erreur lors de la récupération du cours :", error);
      }
    };

    fetchCourse();
  }, [id]);

  const [inputs, setInputs] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    videoUrl: "",
    chapters: [],
    isPublished: false,
    categoryId: null,
    file: null,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du prix
    if (isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      setError("Le prix doit être un nombre valide et supérieur à 0");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/course/update/${id}`, inputs, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      navigate("/administrator/courses");
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  const openModal = (chapterId) => {
    setChapterToDelete(chapterId);
    setCourseToDelete(null);
    setIsModalOpen(true);
  };

  const openDeleteCourseModal = (courseId) => {
    setCourseToDelete(courseId);
    setChapterToDelete(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setChapterToDelete(null);
    setCourseToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (chapterToDelete) {
      try {
        await axios.delete(`${BASE_URL}/api/chapter/delete/${chapterToDelete}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting chapter:", error);
      } finally {
        closeModal();
      }
    } else if (courseToDelete) {
      try {
        await axios.delete(`${BASE_URL}/api/course/delete/${courseToDelete}`);
        navigate("/administrator/courses");
      } catch (error) {
        console.error("Error deleting course:", error);
      } finally {
        closeModal();
      }
    }
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, isPublished: newStatus } : course,
      ),
    );
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
      <div className="p-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h1 className="text-xl font-medium md:text-2xl">
            Mise en place de la formation
          </h1>
          <div className="flex items-center gap-x-2">
            <PublishButton
              inputs={inputs}
              courseId={id}
              isPublished={inputs.isPublished}
              onStatusChange={(newStatus) =>
                handleStatusChange(courses.id, newStatus)
              }
            />
            <button
              className="rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-800"
              title="Supprimer la formation"
              type="button"
              onClick={() => openDeleteCourseModal(id)}
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
                <h2 className="text-xl">Personnalisez votre formation</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  label="Titre de la formation"
                  required
                  name="title"
                  id="formation"
                  type="text"
                  value={inputs.title}
                  onChange={handleChange}
                  className="dark:text-white"
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="-mb-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description de la formation
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
                <h2 className="text-xl">Image de la formation</h2>
              </div>
              <div className="my-6 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="-mb-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image de la formation
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
                    <span className="mt-2 text-center text-sm leading-normal">
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
                  className="text-sm font-medium text-gray-900 dark:text-white"
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
                  className="dark:text-white"
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
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <div className="flex items-center justify-between font-medium">
                    <label
                      htmlFor="chapterTitle"
                      className="-mb-3 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Titre du chapitre
                    </label>

                    <Link to={`/administrator/create-chapter/${id}`}>
                      <button
                        size="sm"
                        className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-400 dark:hover:text-black"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter chapitre
                      </button>
                    </Link>
                  </div>
                  {inputs.chapters.length === 0 && (
                    <p className="text-sm italic text-gray-600">
                      Pas de chapitres
                    </p>
                  )}
                  {inputs.chapters.length > 0 &&
                    inputs.chapters
                      .slice()
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                      )
                      .map((chapter) => (
                        <div
                          key={chapter.id}
                          className="mt-6 space-y-2 rounded-md border p-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm italic text-gray-800 dark:text-white">
                              {chapter.title}
                            </p>
                            <div className="flex items-center gap-x-2">
                              <Link
                                to={`/administrator/course/${id}/edit-chapter/${chapter.id}`}
                              >
                                <button
                                  size="sm"
                                  className="flex items-center rounded-md p-2 text-sm hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-400 dark:hover:text-black"
                                >
                                  <Pen className="mr-1 h-4 w-4" />
                                  Modifier
                                </button>
                              </Link>
                              <button
                                onClick={() => openModal(chapter.id)}
                                className="flex items-center rounded-md bg-red-600 p-2 text-sm text-white hover:bg-red-500 focus:outline-none"
                                type="button"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                      className="lucide lucide-video text-green-500"
                    >
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                      <rect x="2" y="6" width="14" height="12" rx="2" />
                    </svg>
                  </div>
                  <h2 className="text-xl">Vidéo aperçu de la formation</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  {videoUrl && (
                    <div className="mb-4">
                      <Vimeo
                        video={videoUrl}
                        responsive={true}
                        autoplay={false}
                      />
                    </div>
                  )}
                  <Input
                    label="Vidéo aperçu de la formation"
                    required
                    name="videoUrl"
                    id="videoUrl"
                    type="text"
                    value={inputs.videoUrl}
                    onChange={handleChange}
                    className="dark:text-white"
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
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:border-gray-600 dark:bg-white dark:text-black dark:placeholder-gray-400"
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
            <Modal
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              handleConfirmDelete={handleConfirmDelete}
              message={
                courseToDelete
                  ? "Voulez-vous vraiment supprimer cette formation ?"
                  : "Voulez-vous vraiment supprimer ce chapitre ?"
              }
            />
          </div>
          <div className="flex justify-center">
            <Button
              className="mt-6 w-min dark:bg-white dark:text-black dark:hover:bg-gray-400"
              onClick={handleSubmit}
            >
              Modifier
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default editCourse;
