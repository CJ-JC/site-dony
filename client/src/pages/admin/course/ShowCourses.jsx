import { Button } from "@material-tailwind/react";
import { PencilIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "@/components/search/SearchInput";
import { Typography } from "@material-tailwind/react";
import axios from "axios";

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/course`);
        setCourses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };
    fetchCourses();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les cours en fonction de la recherche
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate the courses to display on the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );

  // Handle search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Table of Courses */}
      <div className="relative flex w-full flex-col overflow-scroll rounded-lg border bg-white bg-clip-border p-4 text-gray-700 shadow-md dark:bg-[#25303F]">
        <Typography
          variant="h3"
          className="mb-3 text-xl font-bold dark:text-white md:text-3xl"
          color="blue-gray"
        >
          Liste des formations
        </Typography>
        <div className="flex-column mb-4 flex flex-wrap items-center justify-center space-y-4 sm:flex-row sm:space-y-4 md:justify-between">
          <SearchInput handleSearch={handleSearch} searchQuery={searchQuery} />
          <Link to={"/administrator/create-course"}>
            <Button
              variant="gradient"
              size="sm"
              className="flex items-center text-white focus:outline-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle formation
            </Button>
          </Link>
        </div>
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-[#F9FAFB] font-medium text-gray-700 dark:bg-blue-gray-700 dark:text-white">
            <tr>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Titre
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Catégorie
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Prix
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  État
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Action
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course, index) => (
              <tr
                className="hover:bg-slate-50 border-slate-200 border-b dark:text-white"
                key={index}
              >
                <td className="p-4 py-5">
                  <p className="text-slate-800 block text-sm font-semibold">
                    {course.title}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-800 block text-sm font-semibold">
                    {course.category
                      ? course.category.title
                      : "Catégorie non définie"}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-500 text-sm">{course.price}€</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-500 text-sm">
                    {course.isPublished ? (
                      <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        Publié
                      </span>
                    ) : (
                      <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Non publié
                      </span>
                    )}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <Link
                    to={`/administrator/edit-course/${course.id}`}
                    className="flex w-min items-center gap-1 rounded-lg border bg-blue-gray-100 p-2 text-sm font-medium text-black dark:text-blue-500"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-slate-500 text-sm dark:text-white">
            Afficher{" "}
            <b>
              {indexOfFirstCourse + 1}-
              {Math.min(indexOfLastCourse, filteredCourses.length)}
            </b>{" "}
            sur <b>{filteredCourses.length}</b>
          </div>
          <div className="flex space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                currentPage === 1
                  ? "border-gray-200 bg-gray-100 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Précédent
            </button>
            {[
              ...Array(
                Math.ceil(filteredCourses.length / coursesPerPage),
              ).keys(),
            ].map((page) => (
              <button
                key={page + 1}
                onClick={() => paginate(page + 1)}
                className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                  currentPage === page + 1
                    ? "border-gray-800 bg-gray-800 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={
                currentPage ===
                Math.ceil(filteredCourses.length / coursesPerPage)
              }
              onClick={() => paginate(currentPage + 1)}
              className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                currentPage ===
                Math.ceil(filteredCourses.length / coursesPerPage)
                  ? "border-gray-200 bg-gray-100 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowCourses;
