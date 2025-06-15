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

        // Trier les cours publiés par date de création
        const sortedMasterclass = publishedMasterclasses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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

  const colorMap = {
    Basse: "#FF7703",
    Batterie: "#2D6A50",
    Guitare: "#023047",
    Piano: "#DC143D",
    Chant: "#000000",
  };

  const categories = [
    { id: "1", name: "Basse", icon: "/img/basse.svg" },
    { id: "2", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "3", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "4", name: "Piano", icon: "/img/piano.svg" },
    { id: "5", name: "Chant", icon: "/img/piano.svg" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto h-auto max-w-screen-xl p-4 py-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <section className="mb-10 text-center">
          <Typography
            variant="h2"
            color="blue-gray"
            className=" text-3xl font-light dark:text-white"
          >
            Inscrivez-vous à nos Masterclasses
          </Typography>
          <Typography className="text-gray-800 dark:text-white">
            Découvrez des cours intensifs dispensés par des professionnels de la
            musique. Améliorez vos compétences et faites passer votre talent au
            niveau supérieur.
          </Typography>
        </section>

        <div className="mb-5 flex justify-center">
          <Categories items={categories} />
        </div>

        {filteredMasterclasses.length !== 0 ? (
          <>
            {/* Upcoming Sessions */}
            <section className="mb-12">
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-6 text-2xl font-bold dark:text-white"
              >
                Prochaines Sessions
              </Typography>
              <div className="grid gap-6 lg:grid-cols-1">
                {filteredMasterclasses.map((masterclass, index) => (
                  <div className="flex items-start gap-4" key={index}>
                    <div className="hidden flex-col items-center md:flex">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-gray-900 text-2xl text-white">
                        {index + 1}
                      </div>
                      <div className="mt-2 h-56 w-1 bg-gray-500"></div>
                    </div>

                    <Card className="flex-1 rounded-3xl border text-white shadow dark:bg-gray-800">
                      <CardBody className="flex flex-col items-center gap-6 p-4 md:flex-row">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={`${CoursesImage}${masterclass.imageUrl}`}
                            alt={`${masterclass.title}`}
                            className="h-[250px] w-[350px] rounded-lg object-cover"
                          />
                        </div>
                        <div className="w-full">
                          <div className="mb-2 flex flex-col items-center justify-between gap-2 md:flex-row">
                            {/* <div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-white">
                                    Début :
                                  </span>
                                  <Typography className="text-md font-medium text-gray-700 dark:text-white">
                                    {new Date(
                                      masterclass.startDate,
                                    ).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                    })}
                                  </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-white">
                                    Fin :
                                  </span>
                                  <Typography className="text-md font-medium text-gray-700 dark:text-white">
                                    {new Date(
                                      masterclass.endDate,
                                    ).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </div>
                              </div>
                            </div> */}
                            <div>
                              <span
                                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white"
                                style={{
                                  backgroundColor:
                                    colorMap[masterclass.category.title] ||
                                    "#E5E7EB", // fallback gris clair
                                }}
                              >
                                {masterclass.category.title}
                              </span>
                            </div>

                            <div>
                              <Countdown
                                targetDate={masterclass.startDate}
                                startDate={masterclass.startDate}
                                endDate={masterclass.endDate}
                              />
                            </div>
                          </div>
                          <Typography
                            variant="h5"
                            className="mb-2 font-medium text-gray-900 dark:text-white"
                          >
                            {masterclass.title}
                          </Typography>

                          <ReactQuill
                            value={
                              masterclass.description.length > 150
                                ? masterclass.description.substring(
                                    0,
                                    masterclass.description.lastIndexOf(
                                      " ",
                                      150,
                                    ),
                                  ) + "..."
                                : masterclass.description
                            }
                            readOnly={true}
                            theme="bubble"
                            className="text-gray-700 dark:text-white"
                          />
                          <hr className="my-4 dark:border-gray-700" />
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                {masterclass.instructor?.imageUrl ? (
                                  <img
                                    src={`${CoursesImage}${masterclass.instructor?.imageUrl}`}
                                    alt={masterclass.instructor?.name}
                                    className="h-14 w-14 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="rounded-full bg-gray-400">
                                    <User className="h-14 w-14" />
                                  </div>
                                )}

                                <Mic className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-red-400" />
                              </div>
                              <Typography
                                variant="h6"
                                className="text-gray-700 dark:text-white"
                              >
                                {masterclass.instructor?.name}
                              </Typography>
                            </div>
                            <Link to={`/masterclass/slug/${masterclass.slug}`}>
                              <Button
                                size="md"
                                className="mt-4 px-6 py-3 text-white dark:bg-white dark:text-black dark:hover:bg-gray-300"
                              >
                                Voir plus
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
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
