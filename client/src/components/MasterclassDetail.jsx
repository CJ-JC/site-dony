import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import Countdown from "../widgets/utils/Countdown";
import {
  Calendar,
  Clock,
  Users,
  Euro,
  Hourglass,
  CalendarClock,
} from "lucide-react";
import ReactQuill from "react-quill";
import FormatHour from "@/widgets/utils/FormatHour";
import Loading from "@/widgets/utils/Loading";
import { CalculateDuration } from "@/widgets/utils/CalculateDuration";
import MasterclassRegistration from "@/widgets/utils/MasterclassRegistration";
import axios from "axios";
import { handleCheckout } from "@/widgets/utils/PaymentService";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const MasterclassDetail = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { slug } = useParams();
  const [masterclass, setMasterclass] = useState(null);
  const [error, setError] = useState();
  const [hasPurchasedMasterclass, setHasPurchasedMasterclass] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  useEffect(() => {
    const fetchMasterclassDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/masterclass/slug/${slug}`,
        );
        if (!response.ok) {
          navigate("/");
          return;
        }
        const data = await response.json();
        setMasterclass(data);
      } catch (error) {
        setError(
          "Erreur lors de la récupération des détails de la masterclass",
        );
      }
    };

    fetchMasterclassDetails();
  }, [slug]);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        if (masterclass) {
          const response = await axios.get(
            `${BASE_URL}/api/payment/check-purchase?id=${masterclass?.id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setHasPurchasedMasterclass(response.data.hasPurchasedMasterclass);
        }
      } catch (error) {
        setError("Erreur lors de la vérification de l'achat.");
      }
    };

    checkPurchase();
  }, [masterclass]);

  const handleCheckoutClick = () => {
    if (!isLoggedIn && !user) {
      navigate("/sign-in");
    }

    handleCheckout({
      masterclass,
      isLoggedIn,
      navigate,
      setError,
    });
  };

  if (!masterclass) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto my-4 max-w-screen-xl p-4">
      {/* En-tête de la masterclass */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-md p-2">
              <img
                src={
                  masterclass.image || `${CoursesImage}${masterclass.imageUrl}`
                }
                alt={masterclass.title}
                className="h-[200px] w-full object-cover md:h-[350px]"
              />
            </div>

            <div className="space-y-6 self-center">
              <Typography variant="h2" className="text-2xl font-bold">
                {masterclass.title}
              </Typography>

              {/* Compte à rebours */}
              <div className="rounded-lg bg-[#F9FAFB] p-4 dark:bg-gray-800">
                <Typography variant="h6" className="mb-2 dark:text-white">
                  Début de la masterclass dans :
                </Typography>
                <Countdown
                  targetDate={masterclass.startDate}
                  startDate={masterclass.startDate}
                  endDate={masterclass.endDate}
                />
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-800">
                  <Calendar className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    {new Date(masterclass.startDate).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Clock className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    <FormatHour masterclass={masterclass} />
                  </Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Users className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    {masterclass.maxParticipants} participants max
                  </Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Euro className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    {masterclass.price}
                  </Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <Hourglass className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    Durée totale :{" "}
                    <CalculateDuration
                      startDate={masterclass.startDate}
                      endDate={masterclass.endDate}
                    />
                  </Typography>
                </div>
                <div className="flex items-center space-x-2 text-gray-800">
                  <CalendarClock className="h-5 w-5 dark:text-gray-400" />
                  <Typography className="font-semibold dark:text-white">
                    Durée de chaque réunion : {masterclass.duration}h
                  </Typography>
                </div>
              </div>

              {/* Bouton d'inscription */}
              {hasPurchasedMasterclass ? (
                new Date() < new Date(masterclass.startDate) ? (
                  <div className="rounded-lg bg-green-500/10 p-0.5 text-center">
                    <p className="text-lg font-bold text-green-700">
                      Félicitations ! 🎉
                    </p>
                    <p className="text-gray-700 dark:text-white">
                      Vous êtes déjà inscrit(e) à cette masterclass. <br />{" "}
                      Rendez-vous le{" "}
                      <span className="font-semibold text-green-700">
                        {new Date(masterclass.startDate).toLocaleDateString()}
                      </span>{" "}
                      pour commencer.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                    <p className="text-lg font-bold text-blue-700">
                      Masterclass disponible !
                    </p>
                    <p className="mt-2 text-gray-700">
                      La masterclass a déjà commencé ou est terminée. Vous
                      pouvez accéder aux ressources en cliquant ci-dessous.
                    </p>
                    <button
                      onClick={() => navigate(`/masterclass/${masterclass.id}`)}
                      className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Accéder à la Masterclass
                    </button>
                  </div>
                )
              ) : (
                <MasterclassRegistration
                  targetDate={masterclass.startDate}
                  startDate={masterclass.startDate}
                  handleCheckoutClick={handleCheckoutClick}
                />
              )}
            </div>
          </div>

          {/* Description détaillée */}
          <div className="mt-8 border p-4 dark:bg-gray-800">
            <Typography
              variant="h4"
              className="mb-4 text-gray-900 dark:text-white"
            >
              À propos de cette masterclass
            </Typography>
            <ReactQuill
              value={masterclass.description}
              readOnly={true}
              theme="bubble"
              className="text-gray-700 dark:text-white"
            />
          </div>

          {/* Instructeur */}
          <div className="mt-8 border p-4 dark:bg-gray-800">
            <Typography
              variant="h4"
              className="mb-4 text-gray-900 dark:text-white"
            >
              Votre instructeur
            </Typography>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-[auto,1fr] md:items-center">
              <img
                src={`${CoursesImage}${masterclass.instructor?.imageUrl}`}
                alt={masterclass.instructor?.name}
                className="w-h-40 mx-auto h-40 rounded-xl object-cover md:mx-0"
              />
              <div>
                <Typography
                  variant="h6"
                  className="pl-1 text-gray-800 dark:text-white"
                >
                  {masterclass.instructor?.name}
                </Typography>
                <ReactQuill
                  value={masterclass.instructor?.biography}
                  readOnly={true}
                  theme="bubble"
                  className="text-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MasterclassDetail;
