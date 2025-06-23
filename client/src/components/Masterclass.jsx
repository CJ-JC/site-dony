import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import { Mic, User } from "lucide-react";
import Countdown from "../widgets/utils/Countdown";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import Loading from "@/widgets/utils/Loading";
import { motion } from "framer-motion";
import Categories from "./search/Categories";
import { useSearchParams } from "react-router-dom";

const MasterClass = () => {
  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/masterclass`);
        // Tri par date de début (startDate) croissante

        // Filtrer uniquement les cours publiés
        const publishedMasterclasses = response.data.filter(
          (masterclass) => masterclass.isPublished,
        );

        // Trier les cours publiés par date de de début
        const sortedMasterclass = publishedMasterclasses.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate),
        );

        setMasterclasses(sortedMasterclass);
      } catch (error) {
        setError("Erreur lors de la récupération de la masterclass");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterclass();
  }, []);

  const filteredMasterclasses = selectedCategoryId
    ? masterclasses.filter(
        (mc) => mc.categoryId?.toString() === selectedCategoryId,
      )
    : masterclasses;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMasterclasses = filteredMasterclasses.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  const totalPages = Math.ceil(filteredMasterclasses.length / itemsPerPage);

  const colorMap = {
    Basse: "#FF7703",
    Batterie: "#2D6A50",
    Guitare: "#023047",
    Piano: "#DC143D",
    Chant: "#000000",
  };

  const categories = [
    { id: "1", name: "Piano", icon: "/img/piano.svg" },
    { id: "2", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "3", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "4", name: "Basse", icon: "/img/basse.svg" },
    { id: "5", name: "Chant", icon: "/img/mic.svg" },
  ];

  const transparentColorMap = {
    Piano: "rgba(220, 20, 61, 0.2)",
    Guitare: "rgba(2, 48, 71, 0.2)",
    Batterie: "rgba(45, 106, 80, 0.2)",
    Basse: "rgba(255, 119, 3, 0.2)",
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto h-auto max-w-screen-xl p-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <section className="text-center">
          <Typography
            variant="h2"
            color="blue-gray"
            className=" text-3xl font-light dark:text-white"
          >
            Inscrivez-vous à nos Masterclass
          </Typography>
          <Typography className="text-gray-800 dark:text-white">
            Découvrez des cours intensifs dispensés par des professionnels de la
            musique. Améliorez vos compétences et faites passer votre talent au
            niveau supérieur.
          </Typography>
        </section>

        <div className="my-10 flex justify-center">
          <Categories items={categories} />
        </div>

        {currentMasterclasses.length !== 0 ? (
          <>
            {/* Upcoming Sessions */}
            <section className="mb-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentMasterclasses.map((mc) => (
                  <div
                    key={mc.id}
                    className="relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-md dark:bg-gray-800"
                  >
                    {/* Image de fond */}
                    <div
                      className="relative h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${CoursesImage}${mc.imageUrl})`,
                      }}
                    >
                      {/* <div className="absolute inset-0 bg-black/60" /> */}
                    </div>
                    {/* Contenu */}
                    <div className="flex flex-1 flex-col space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <div className="z-10 flex w-full text-sm font-semibold dark:text-white">
                          {new Date(mc.startDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </div>
                        <span
                          className=" right-0 z-30 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white"
                          style={{
                            backgroundColor:
                              transparentColorMap[mc.category.title] ||
                              "rgba(0,0,0,0.1)",
                            color: colorMap[mc.category.title] || "#000",
                          }}
                        >
                          {mc.category.title}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-700 dark:text-white">
                        {mc.title}
                      </h3>

                      <div className="mt-2 flex justify-center">
                        <Countdown
                          targetDate={mc.startDate}
                          startDate={mc.startDate}
                          endDate={mc.endDate}
                        />
                      </div>
                      <div className="mt-auto flex justify-center">
                        <Link to={`/masterclass/slug/${mc.slug}`}>
                          <Button
                            size="md"
                            className="dark:bg-white dark:text-black dark:hover:bg-gray-300"
                          >
                            En savoir plus
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  variant={currentPage === index + 1 ? "filled" : "outlined"}
                  className="h-10 w-10 rounded-full px-4 py-3 dark:text-white dark:hover:bg-gray-700"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <section className="mb-12 flex h-screen flex-col items-center justify-center">
            <p className="dark:text-white">
              Pas de sessions disponibles pour le moment.
            </p>
          </section>
        )}
      </motion.div>
    </div>
  );
};

export default MasterClass;
