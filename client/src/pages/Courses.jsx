import React, { useState } from "react";
import CourseList from "@/components/CourseList";
import SearchInput from "@/components/search/SearchInput";
import Categories from "@/components/search/Categories";
import useCourses from "@/widgets/utils/UseCourses";
import usePagination from "@/widgets/utils/usePagination";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Courses = () => {
  const categories = [
    { id: "1", name: "Basse", icon: "/img/basse.svg" },
    { id: "2", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "3", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "4", name: "Piano", icon: "/img/piano.svg" },
  ];

  const { courses, discountedCourses } = useCourses();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("title") || "",
  );

  const categoryId = searchParams.get("categoryId");
  const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : null;

  const filteredCourses = discountedCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = parsedCategoryId
      ? course.category?.id === parsedCategoryId
      : true;

    return matchesSearch && matchesCategory;
  });

  // Utiliser le hook de pagination
  const { currentItems, currentPage, totalPages, paginate } = usePagination(
    filteredCourses,
    8,
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    paginate(1);
  };

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-6">
      <>
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="block py-6 pt-6 md:mb-0 md:hidden">
            <SearchInput
              handleSearch={handleSearch}
              searchQuery={searchQuery}
            />
          </div>
          <div className="max-md:justify-center flex">
            <div className="mr-5 hidden md:block">
              <SearchInput
                handleSearch={handleSearch}
                searchQuery={searchQuery}
              />
            </div>
            <Categories items={categories} />
          </div>

          <div className="h-auto">
            <CourseList courses={currentItems} />
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center">
            <nav>
              <ul className="inline-flex space-x-1">
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`border px-4 py-2 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Précédent
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1}>
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`border px-4 py-2 ${
                        currentPage === i + 1
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`border px-4 py-2 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>
      </>
    </section>
  );
};

export default Courses;
