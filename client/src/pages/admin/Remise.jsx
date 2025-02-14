import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";

const AddRemise = () => {
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [expirationDate, setExpirationDate] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [selectedRemise, setSelectedRemise] = useState("");
  const [availableRemises, setAvailableRemises] = useState([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [discountedCourses, setDiscountedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Charger les remises existants
  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/remise`);
        setAvailableRemises(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    // Charger les cours disponibles
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/course`);

        const publishedCourses = response.data.filter(
          (course) => course.isPublished,
        );

        const sortedCourses = publishedCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setCourses(sortedCourses);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };

    fetchCourses();
    fetchRemises();
  }, []);

  const handleApplyRemise = async (discountPercentage, courseId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/remise/apply-remise`, {
        discountPercentage,
        courseId,
      });

      const { courses } = response.data;
      setDiscountedCourses(courses);
    } catch (err) {
      setError(
        err.response?.data?.error || "Impossible d'appliquer le remise.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRemise = () => {
    if (!discountPercentage || !expirationDate) {
      setError("Tous les champs sont requis !");
      return;
    }

    axios
      .post(`${BASE_URL}/api/remise/create`, {
        discountPercentage,
        expirationDate,
        courseId: isGlobal ? null : courseId, // Null si le remise est global
        isGlobal,
      })
      .then((response) => {
        setAvailableRemises((prev) => [...prev, response.data]); // Ajouter le nouveau remise à la liste
        setDiscountPercentage(0);
        setExpirationDate("");
        setCourseId(null);
        setIsGlobal(false);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Une erreur est survenue.");
      });
  };

  const handleDeleteRemise = async (selectedRemise) => {
    try {
      await axios.delete(`${BASE_URL}/api/remise/delete/${selectedRemise}`);
      setSelectedRemise("");
      setAvailableRemises([]);
      setError("");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="container mx-auto rounded-md border bg-white p-4 shadow-md dark:bg-[#25303F]">
      <h1 className="mb-4 text-2xl font-bold">Ajouter une Remise</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="mb-4">
          <Input
            label="Pourcentage de réduction"
            className="dark:text-white"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Date d'expiration"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Tous les cours
          </label>
          <select
            id="course"
            value={courseId || ""}
            onChange={(e) => setCourseId(e.target.value)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-white dark:text-white"
          >
            <option value="">Tous les cours</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 inline-flex items-center">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="ripple-on"
            data-ripple-dark="true"
          >
            <input
              id="isGlobal"
              type="checkbox"
              name="isGlobal"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              className="border-slate-300 before:bg-slate-400 checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 peer relative h-5 w-5 cursor-pointer appearance-none rounded border shadow transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
            />
            <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-black opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label className="cursor-pointer text-sm" htmlFor="isGlobal">
            Appliquer la remise globale
          </label>
        </div>
      </div>
      <div className="my-5">
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleAddRemise}
          className="dark:bg-white dark:text-black dark:hover:bg-gray-400"
        >
          Créer la remise
        </Button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Cours réduits :</h3>
        {discountedCourses.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {discountedCourses.map((course) => (
              <li key={course.courseId} className="mb-4 rounded border p-2">
                <p>
                  <strong>{course.title}</strong>
                </p>
                <p>Prix original : {course.originalPrice}€</p>
                <p>Prix réduit : {course.discountedPrice.toFixed(2)}€</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cours réduit pour l'instant.</p>
        )}
      </div>
      <h2 className="mt-8 text-xl font-bold">Remises Disponibles</h2>
      <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {availableRemises.length > 0 ? (
          availableRemises.map((remise) => (
            <li key={remise.id} className="mb-2 rounded-md border p-4">
              <p>
                <strong>Pourcentage de réduction :</strong>{" "}
                {remise.discountPercentage}%
              </p>
              <p>
                <strong>Date d'expiration :</strong>{" "}
                {new Date(remise.expirationDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Applicabilité :</strong>{" "}
                {remise.course ? `${remise.course.title}` : "Tous les cours"}
              </p>

              <div className="mt-3 flex flex-wrap justify-between">
                <Button
                  onClick={() =>
                    handleApplyRemise(
                      remise.discountPercentage,
                      remise.courseId || null,
                    )
                  }
                  disabled={loading}
                  className="w-min dark:bg-white dark:text-black dark:hover:bg-gray-400"
                >
                  {loading ? "Application..." : "Appliquer"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleDeleteRemise(remise.id)}
                  className="w-min border-red-500 text-red-500"
                >
                  Supprimer
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p>Aucune remise disponible pour le moment.</p>
        )}
      </ul>
    </div>
  );
};

export default AddRemise;
