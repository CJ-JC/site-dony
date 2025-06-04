import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "@/widgets/layout";
import CourseList from "@/components/CourseList";
import useCourses from "@/widgets/utils/UseCourses";
import Countdown from "@/widgets/utils/Countdown";
import Loading from "@/widgets/utils/Loading";
import axios from "axios";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import { CircleHelp, Monitor, Music, Rocket, UsersRound } from "lucide-react";
import Contact from "@/components/Contact";
import { useSelector } from "react-redux";
import Vimeo from "@u-wave/react-vimeo";
import { CalendarCheck, Video } from "lucide-react";
import { Button, CardBody, Card, Typography } from "@material-tailwind/react";

export function Home() {
  const { discountedCourses, globalDiscount, availableRemises } = useCourses();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/masterclass`);
        setMasterclasses(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération de la masterclass");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterclass();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const firstMasterclass = masterclasses[0];

  return (
    <>
      <div className="relative flex h-[700px] content-center items-center justify-center pb-32 pt-16">
        <video
          className="absolute top-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/img/dony-music.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 h-full w-full bg-black/80 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="lg:w-8/10 ml-auto mr-auto w-full px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  color="white"
                  className="mb-2 text-3xl font-light md:text-5xl"
                >
                  Éveillez Votre Passion pour la Musique !
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                <Typography variant="lead" color="white" className="opacity-80">
                  Plongez dans un univers musical où chaque note prend vie.
                  Explorez des cours adaptés à tous les niveaux. <br /> Que vous
                  souhaitiez apprendre un nouvel instrument ou perfectionner
                  votre technique, nous avons ce qu'il vous faut. <br /> Venez
                  développer votre passion et laissez votre créativité
                  s'exprimer !
                </Typography>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto -mt-24 max-w-screen-xl px-4 pb-20">
        <div className="container mx-auto">
          {firstMasterclass?.id && (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              <Card className="rounded-lg shadow-lg shadow-gray-500/10 dark:bg-gray-800">
                <CardBody className="px-4 py-6">
                  <div className="flex flex-col items-center justify-between gap-x-10 md:flex-row">
                    <div>
                      <Typography
                        variant="h5"
                        className="px-2 font-bold text-gray-900 dark:text-white"
                      >
                        {firstMasterclass?.title}
                      </Typography>
                      <div className="text-sm text-gray-800 dark:text-white">
                        <ReactQuill
                          value={
                            firstMasterclass?.description?.length > 200
                              ? firstMasterclass?.description.substring(
                                  0,
                                  firstMasterclass?.description.lastIndexOf(
                                    " ",
                                    200,
                                  ),
                                ) + "..."
                              : firstMasterclass?.description
                          }
                          readOnly={true}
                          theme="bubble"
                        />
                      </div>
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className="text-gray-800 dark:text-white"
                      >
                        Début dans :
                      </Typography>
                      <Countdown
                        targetDate={firstMasterclass?.startDate}
                        startDate={firstMasterclass?.startDate}
                        endDate={firstMasterclass?.endDate}
                      />
                    </div>
                  </div>
                  <div className="flex w-full justify-center">
                    <Link to="/masterclass">
                      <Button
                        size="md"
                        className="mt-4 px-6 py-3 dark:bg-white dark:text-black dark:hover:bg-gray-300"
                      >
                        En savoir plus
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
          <section className="mt-32 flex flex-wrap items-center">
            <div className="container mx-auto dark:text-white">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <PageTitle heading="Nos cours">
                  Découvrez une gamme variée de cours conçus pour inspirer et
                  accompagner chaque musicien dans son parcours. Du piano à la
                  batterie en passant par le jazz et l’harmonisation, vous
                  trouverez des programmes enrichissants qui stimulent votre
                  créativité musicale et renforcent votre confiance.
                </PageTitle>

                <CourseList
                  courses={discountedCourses.slice(0, 4)}
                  globalDiscount={globalDiscount}
                  availableRemises={availableRemises}
                />

                <div className="my-24 flex justify-center">
                  <Link to={`/courses`} className="rounded-full">
                    <Button className="dark:bg-white dark:text-black dark:hover:bg-gray-300">
                      Voir tous les cours
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </section>

      <section className="relative mx-auto -mt-28  mb-28 flex items-center bg-[url('/img/piano-back.jpg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 py-20">
        <div className="absolute inset-0 bg-black/80" />

        <div className="container relative z-10 mx-auto max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="relative inline-block">
              <Typography
                variant="h2"
                className="text-center font-light text-white"
              >
                Nos masterclasses
              </Typography>
              <span className="absolute -bottom-1 left-0 block h-1 w-full bg-orange-600"></span>
            </div>

            <p className="mx-auto mt-4 max-w-5xl text-xl text-white">
              Piano, guitare, batterie, basse… Nos masterclasses s'adressent à
              tous les musiciens, du passionné au professionnel. Accédez à une
              formation de qualité, animée par des artistes expérimentés.
            </p>
          </motion.div>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={firstMasterclass?.imageUrl}
                alt="Masterclass piano"
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h3 className="text-2xl font-semibold text-white">
                Ce que vous allez apprendre :
              </h3>
              <ul className="space-y-4 text-white">
                <li className="flex items-center space-x-3">
                  <CalendarCheck className="w-8 text-orange-600" />
                  <span>
                    <strong>Techniques avancées</strong> et{" "}
                    <strong>interprétation expressive</strong> adaptées à chaque
                    niveau.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Video className="w-8 text-orange-600" />
                  <span>
                    <strong>Sessions en direct</strong> avec les intervenants.
                  </span>
                </li>
                <li className="flex items-center space-x-5">
                  <Music className="w-8 font-bold text-orange-600" />
                  <span>
                    <strong>
                      Analyse d’œuvres classiques et contemporaines
                    </strong>
                    , avec une approche pédagogique détaillée.
                  </span>
                </li>
                <li className="flex items-center space-x-5">
                  <CircleHelp className="w-10 font-bold text-orange-600" />
                  <span>
                    <strong>Interactivité garantie</strong> : posez vos
                    questions en direct ou par écrit, échanges avec les
                    professeurs et retours personnalisés.
                  </span>
                </li>
              </ul>
              <div className="flex items-center justify-center md:justify-start">
                <Button
                  size="md"
                  onClick={() => navigate("/masterclass")}
                  className="bg-white px-6 py-3 text-black hover:bg-gray-300"
                >
                  Rejoindre une Masterclass
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* About */}
      {/* <section className="-mt-28 "> */}
      <div className="mx-auto -mt-28 max-w-screen-xl px-4 py-20">
        <div className="container mx-auto">
          <PageTitle heading="Découvrez votre formateur">
            Apprenez à connaître votre formateur
          </PageTitle>

          <div className="mt-12 grid items-center gap-2 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="mt-4 flex items-center space-x-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dony Paul
                  </h3>
                  <div className="space-y-2 text-justify text-gray-800 dark:text-white">
                    <p>
                      Musicien professionnel et formateur depuis plus de 10 ans,
                      j’ai suivi une formation au conservatoire puis dans une
                      école privée, me spécialisant en interprétation,
                      composition et arrangement. <br /> Passionné par la
                      transmission, j’ai accompagné de nombreux élèves grâce à
                      des cours alliant rigueur pédagogique, approche ludique et
                      interactivité.{" "}
                    </p>
                    <p>
                      <strong>Mon objectif :</strong> offrir un cadre stimulant
                      où chacun développe ses compétences techniques tout en
                      cultivant sa passion pour la musique, pour progresser
                      pleinement en tant qu’artiste.
                    </p>
                  </div>

                  <div className="mt-2 flex space-x-2">
                    <motion.i
                      whileHover={{ scale: 1.2 }}
                      className="w-10 text-black"
                    >
                      <a
                        href="https://www.tiktok.com/@donymusic0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={"./img/tiktok.svg"} alt="" />
                      </a>
                    </motion.i>
                    <motion.i
                      whileHover={{ scale: 1.2 }}
                      className="w-10 text-black"
                    >
                      <a
                        href="https://www.youtube.com/@donymusic0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={"./img/youtube.svg"} alt="" />
                      </a>
                    </motion.i>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Vimeo
                video={"https://vimeo.com/1073164199/d2ed6421f4"}
                responsive={true}
                autoplay={false}
                className="h-full w-full rounded-lg"
              />
            </motion.div>
          </div>
          <div className="mt-12 grid items-center gap-2 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <Vimeo
                video={"https://vimeo.com/1073168976/462d142889"}
                responsive={true}
                autoplay={false}
                className="h-full w-full rounded-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative order-1 md:order-2"
            >
              <Vimeo
                video="https://vimeo.com/1073167180/08212f0c03?ts=0&share=copy"
                responsive={true}
                autoplay={false}
                className="h-full w-full rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {/* </section> */}

      {/* services */}
      <section className="relative mx-auto flex items-center bg-[url('/img/bg-home-2.jpg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 py-20">
        <div className="absolute inset-0 bg-black/80" />

        <div className="container relative z-10 mx-auto max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <Typography
              variant="h2"
              className="text-center font-light text-white"
            >
              Transformez votre avenir dès aujourd'hui !
            </Typography>
            <p className="mb-6 text-lg text-gray-200">
              Rejoignez notre communauté et accédez à des formations exclusives
              pour développer vos compétences et réaliser vos ambitions. <br />{" "}
              {!isLoggedIn && !user && (
                <>
                  Inscrivez-vous dès maintenant et commencez votre parcours vers
                  le succès.
                </>
              )}{" "}
              {isLoggedIn && user && (
                <>Commencez votre parcours vers le succès.</>
              )}
            </p>
            {!isLoggedIn && !user && (
              <div className="flex justify-center">
                <Button
                  size="md"
                  onClick={() => navigate("/sign-up")}
                  className="bg-white px-6 py-3 text-black hover:bg-gray-300"
                >
                  Rejoignez-nous aujourd'hui
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto -mt-28 max-w-screen-xl px-4 py-20">
        <div className="container mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <PageTitle heading="Ce que propose Donymusic">
              Découvrez une plateforme de formation pour développer vos
              compétences musicales et professionnelles.
            </PageTitle>
            <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-gray-800">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-gray-800 dark:text-white">
                    <strong>Formation en ligne</strong> : Accédez à des cours
                    interactifs et flexibles, disponibles 24/7 pour s'adapter à
                    votre emploi du temps.
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-gray-800">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <UsersRound className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-gray-800 dark:text-white">
                    <strong>Communauté dynamique</strong> : Rejoignez une
                    communauté d'apprenants et partagez vos expériences.
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-gray-800">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-gray-800 dark:text-white">
                    <strong>Atteignez de nouveaux sommets</strong> : Progresser
                    n'a jamais été aussi simple. Développez vos compétences et
                    avancez vers vos ambitions.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* bg-[#F9FAFB] */}

      <section className="mx-auto px-4 py-20">
        <Contact />
      </section>
    </>
  );
}

export default Home;
