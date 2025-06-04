import React, { useEffect, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Loading from "@/widgets/utils/Loading";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { handleCheckout } from "@/widgets/utils/PaymentService";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const CourseDetail = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState();
  const [showImage, setShowImage] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [availableRemises, setAvailableRemises] = useState([]);
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/course/slug/${id}`);
        setCourse(response.data);
        setAuthLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération du cours");
      }
    };
    fetchCourse();
  }, [authLoading]);

  useEffect(() => {
    const fetchRemise = async () => {
      try {
        const remiseResponse = await axios.get(
          `${BASE_URL}/api/remise/course/slug/${id}`,
        );
        const remises = remiseResponse.data;

        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          setGlobalDiscount(globalRemise.discountPercentage);
        }

        const specificRemises = remises.filter((remise) => !remise.isGlobal);
        setAvailableRemises(specificRemises);
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    const fetchRemises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/remise`);
        const remises = response.data;

        // Vérification pour les remises globales
        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          const expirationDate = new Date(globalRemise.expirationDate);
          const now = new Date();
          if (expirationDate > now) {
            setGlobalDiscount(globalRemise.discountPercentage);
          } else {
            setGlobalDiscount(null);
          }
        }

        // Filtrer et vérifier les remises spécifiques
        const validSpecificRemises = remises
          .filter((remise) => !remise.isGlobal)
          .filter((remise) => {
            const expirationDate = new Date(remise.expirationDate);
            return expirationDate > new Date();
          });

        setAvailableRemises(validSpecificRemises);
      } catch (error) {
        setError("Erreur lors de la récupération des remises :", error);
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user-progress/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProgress(response.data.progress);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la progression:",
          error,
        );
      }
    };

    fetchProgress();

    fetchRemises();
    fetchRemise();
  }, [id]);

  useEffect(() => {
    if (course) {
      let finalDiscountedPrice = course.price;
      let appliedDiscountPercentage = null;

      // Appliquer la remise globale
      if (globalDiscount) {
        finalDiscountedPrice -= (finalDiscountedPrice * globalDiscount) / 100;
        appliedDiscountPercentage = globalDiscount;
      }

      // Appliquer la remise spécifique pour le cours
      const specificRemise = availableRemises.find(
        (remise) => remise.courseId === course.id,
      );

      if (specificRemise) {
        finalDiscountedPrice -=
          (course.price * specificRemise.discountPercentage) / 100;
        appliedDiscountPercentage = specificRemise.discountPercentage;
      }

      // Mettre à jour le prix final et le pourcentage de réduction
      setDiscountedPrice(parseFloat(finalDiscountedPrice).toFixed(2));
      setDiscountPercentage(appliedDiscountPercentage);
    }
  }, [course, globalDiscount, availableRemises]);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        if (course) {
          const response = await axios.get(
            `${BASE_URL}/api/payment/check-purchase?id=${course?.id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setHasPurchasedCourse(response.data.hasPurchasedCourse);
        }
      } catch (error) {
        setError("Erreur lors de la vérification de l'achat.");
      }
    };

    checkPurchase();
  }, [course]);

  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleVideoError = () => {
    setShowImage(true);
  };

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const countVideos = course.chapters.reduce(
    (acc, chapter) => acc + chapter.videos.length,
    0,
  );

  const handleCheckoutClick = () => {
    handleCheckout({
      course,
      isLoggedIn,
      navigate,
      setError,
      discountedPrice,
    });
  };

  return (
    <div className="mx-auto my-6 h-auto max-w-screen-xl px-2 md:h-screen">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="order-1 col-span-1 flex flex-col space-y-6 lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-4 overflow-hidden rounded-md border p-2">
              <div className="relative aspect-video overflow-hidden">
                {showImage || !course.videoUrl ? (
                  <img
                    src={course.image || `${BASE_URL}${course.imageUrl}`}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Vimeo
                    video={course.videoUrl}
                    responsive={true}
                    autoplay={false}
                    onError={handleVideoError}
                  />
                )}
              </div>
            </div>

            <div className="relative rounded-md border p-3">
              <div className="mb-3 flex items-center justify-between gap-x-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {course.title}
                </h3>
                <div className="focus:ring-ring inline-flex items-center rounded-md border border-transparent bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
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
                    className="lucide lucide-book-open mr-2 h-4 w-4"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span className="dark:text-white">
                    {course.chapters.length}{" "}
                    {course.chapters.length === 1 ? "chapitre" : "chapitres"}
                  </span>
                </div>
              </div>

              <div className="my-3 text-sm text-gray-800 dark:text-white">
                <ReactQuill
                  value={course.description}
                  readOnly={true}
                  theme="bubble"
                />
              </div>
              {course.chapters && course.chapters.length > 0 && (
                <>
                  <div className="flex items-center justify-between border-b">
                    <Typography
                      variant="h5"
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      Contenu du cours
                    </Typography>

                    <div className="text-md flex items-center justify-end gap-x-2 border-gray-300 py-1">
                      <p className="text-sm text-gray-800 dark:text-white">
                        {course.chapters.length}{" "}
                        {course.chapters.length === 1 ? "section" : "sections"}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-white">
                        {countVideos}{" "}
                        {countVideos.length === 1 ? "session" : "sessions"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {course.chapters.map((chapter) => (
                      <Accordion
                        key={chapter.id}
                        open={open === chapter.id}
                        icon={<Icon id={chapter.id} open={open} />}
                      >
                        <AccordionHeader
                          onClick={() => handleOpen(chapter.id)}
                          className="text-lg font-bold dark:text-white"
                        >
                          {chapter.title}
                          <div className="ml-auto">
                            <span className="text-sm text-gray-500 dark:text-white">
                              {chapter.videos.length} session
                              {chapter.videos.length > 1 && "s"}
                            </span>
                          </div>
                        </AccordionHeader>
                        <AccordionBody className="p-0">
                          {chapter.videos && chapter.videos.length > 0 && (
                            <ul className="space-y-2">
                              {chapter.videos.map((video) => (
                                <li key={video.id}>
                                  <button className="my-1 flex w-full items-center gap-x-2 bg-gray-50 p-1 text-sm font-bold transition hover:bg-gray-200 dark:text-black">
                                    {video.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </AccordionBody>
                      </Accordion>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="order-2 flex flex-col space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {(user?.role && user.role === "admin") || hasPurchasedCourse ? (
              <div className="rounded-md border bg-white p-6 shadow-md dark:bg-transparent">
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Continuez là où vous vous êtes arrêté.
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-white">
                    {progress === 0
                      ? "Commencez dès maintenant à visionner le cours."
                      : "Regardez à partir du dernier chapitre terminé."}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  {progress === 0 ? (
                    <Link
                      to={`/course-player/course/${course.id}/chapters/${course.chapters[0].id}`}
                      className="rounded-full"
                    >
                      <Button
                        variant="gradient"
                        className="flex items-center justify-center rounded-lg px-6 py-3 transition"
                      >
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
                          className="lucide lucide-play-circle mr-2 h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                        Commencer le cours
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="gradient"
                      className="flex items-center justify-center rounded-lg px-6 py-3 transition"
                    >
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
                        className="lucide lucide-play-circle mr-2 h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                      Continuer le cours
                    </Button>
                  )}
                </div>

                <div className="mt-6 border-t pt-4 text-sm text-gray-800 dark:text-white">
                  <p className="flex items-center gap-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-info text-blue-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Vous pouvez reprendre là où vous vous êtes arrêté(e).
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-white p-6 shadow-md dark:bg-transparent">
                <div className="mb-6">
                  <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    Accédez à votre formation maintenant
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-white">
                    Bénéficiez d’un accès immédiat à tous les contenus de la
                    formation en procédant au paiement sécurisé.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Affichage du prix et des réductions */}
                  <div className="flex items-center gap-x-4">
                    {discountedPrice && discountedPrice < course.price ? (
                      <>
                        <span className="text-lg font-bold text-gray-800 line-through dark:text-white">
                          {course.price}€
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          {discountedPrice}€
                        </span>
                        <span className="text-sm text-green-600">
                          ({discountPercentage}% de réduction)
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {course.price}€
                      </span>
                    )}
                  </div>

                  {/* Points de valeur ajoutée */}
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-800 dark:text-white">
                    <li>Accès à vie à la formation.</li>
                    <li>Garantie satisfait ou remboursé sous 14 jours.</li>
                    <li>Support pédagogique 24/7.</li>
                  </ul>

                  {/* Bouton de paiement */}
                  <div>
                    <Button
                      variant="gradient"
                      className="checkout-button flex w-full items-center justify-center rounded-lg py-3 transition"
                      onClick={handleCheckoutClick}
                    >
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
                        className="lucide lucide-credit-card mr-2 h-5 w-5"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="22"
                          height="16"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      Procéder au paiement
                    </Button>
                  </div>
                </div>

                {/* Section de garantie ou de confiance */}
                <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-white">
                  <p className="flex items-center gap-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shield-check text-green-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    Paiement sécurisé & protégé.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
