import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "@/widgets/layout";
import Countdown from "@/widgets/utils/Countdown";
import Loading from "@/widgets/utils/Loading";
import axios from "axios";
import { motion } from "framer-motion";
import { Monitor, Rocket, UsersRound } from "lucide-react";
import Contact from "@/components/Contact";
import { Button, Typography } from "@material-tailwind/react";
import Categories from "@/components/search/Categories";
import { useSearchParams } from "react-router-dom";
import Faq from "@/widgets/layout/faq";

export function Home() {
  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId");

  const MasterclassImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const categories = [
    { id: "1", name: "Piano", icon: "/img/piano.svg" },
    { id: "2", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "3", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "4", name: "Basse", icon: "/img/basse.svg" },
    { id: "5", name: "Chant", icon: "/img/mic.svg" },
  ];

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

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/masterclass`);

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

  const categoryIdInt = parseInt(selectedCategoryId);

  const filteredMasterclasses = !isNaN(categoryIdInt)
    ? masterclasses.filter((mc) => mc.categoryId === categoryIdInt).slice(0, 3)
    : masterclasses.slice(0, 3);

  if (isLoading) {
    return <Loading />;
  }

  const colorMap = {
    Piano: "#DC143D",
    Guitare: "#023047",
    Batterie: "#2D6A50",
    Basse: "#FF7703",
    Chant: "#000000",
  };

  const transparentColorMap = {
    Piano: "rgba(220, 20, 61, 0.2)",
    Guitare: "rgba(2, 48, 71, 0.2)",
    Batterie: "rgba(45, 106, 80, 0.2)",
    Basse: "rgba(255, 119, 3, 0.2)",
  };

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
          <source src="/video/dony-music.mp4" type="video/mp4" />
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
                  className="mb-4 text-4xl font-bold leading-tight md:text-6xl"
                >
                  Vivez l'Expérience des Masterclasses Musicales
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                <Typography
                  variant="lead"
                  color="white"
                  className="text-base leading-relaxed opacity-90 md:text-xl"
                >
                  Apprenez avec des musiciens professionnels à travers des
                  sessions immersives, pratiques et inspirantes.{" "}
                  <br className="hidden md:block" />
                  Que vous soyez débutant ou confirmé, explorez notre univers
                  musical et élevez votre talent à un tout autre niveau.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <a href="#formations">
                  <Button
                    className="mt-4 bg-white text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    size="lg"
                  >
                    Nos masterclasses
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-screen-xl px-4 pb-20">
        <div className="mt-20 flex flex-wrap items-center">
          <div className="container mx-auto dark:text-white">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <PageTitle heading="Comment fonctionnent nos formations ?">
                Nos formations en direct sont conçues pour vous offrir une
                expérience d'apprentissage immersive et interactive.
              </PageTitle>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    title: "Rythme régulier",
                    desc: "1h de live chaque semaine pendant 3 mois pour une progression constante et mesurable.",
                    icon: "🎯",
                  },
                  {
                    title: "100% en direct",
                    desc: "Posez vos questions en temps réel et recevez des retours personnalisés de musiciens professionnels.",
                    icon: "🎤",
                  },
                  {
                    title: "Apprentissage en groupe",
                    desc: "Groupes répartis par niveau pour garantir une dynamique de classe optimale.",
                    icon: "👥",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                  >
                    <div className="mb-4 text-3xl">{item.icon}</div>
                    <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto bg-[#FEF7E7] py-20 dark:bg-transparent">
        <div className="container mx-auto max-w-screen-xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <PageTitle heading="Nos disciplines musicales">
              Des cours en direct pour explorer, maîtriser et vivre pleinement
              votre pratique instrumentale.
            </PageTitle>
          </motion.div>

          {/* Première ligne : 3 premiers éléments */}
          <div className="mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Piano",
                description:
                  "Maîtrisez le clavier et développez votre technique à travers un répertoire varié, du classique au contemporain.",
                image: "/img/piano-2.jpg",
                color: "#40CBB4",
              },
              {
                name: "Guitare",
                description:
                  "Apprenez les accords, la rythmique et les solos pour jouer vos morceaux préférés en toute confiance.",
                image: "/img/guitare-2.jpg",
                color: "#4C36A9",
              },
              {
                name: "Basse",
                description:
                  "Découvrez les fondamentaux de la basse et construisez des lignes qui grooveront avec n'importe quelle section rythmique.",
                image: "/img/basse.jpg",
                color: "#E6275A",
              },
            ].map(({ name, description, image, color }) => (
              <div
                key={name}
                className="group relative h-48 overflow-hidden rounded-2xl border border-white shadow-md transition hover:shadow-xl"
              >
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 transition group-hover:bg-black/50" />
                <div className="relative z-10 flex h-full flex-col justify-center p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold" style={{ color }}>
                    {name}
                  </h3>
                  <p className="text-md text-white">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deuxième ligne : centrer 2 derniers éléments */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
            {[
              {
                name: "Batterie",
                description:
                  "Développez votre sens du rythme et maîtrisez les techniques essentielles pour devenir le pilier de votre groupe.",
                image: "/img/batterie.jpg",
                color: "#FF9741",
              },
              {
                name: "Chant",
                description:
                  "Explorez votre voix, améliorez votre technique et exprimez-vous avec assurance et émotion.",
                image: "/img/chant.jpg",
                color: "white",
              },
            ].map(({ name, description, image, color }) => (
              <div
                key={name}
                className="group relative h-48 w-full max-w-md overflow-hidden rounded-2xl border border-white shadow-md transition hover:shadow-xl"
              >
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 transition group-hover:bg-black/50" />
                <div className="relative z-10 flex h-full flex-col justify-center p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold" style={{ color }}>
                    {name}
                  </h3>
                  <p className="text-md text-white">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto px-4 py-20 dark:bg-transparent">
        <div className="container mx-auto max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PageTitle heading="Le programme des cours">
              Découvrez notre programme de cours complet, conçu pour vous
              permettre de progresser à votre rythme. Que vous soyez débutant ou
              confirmé, nos formations couvrent tous les aspects de la musique.
            </PageTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Mois 1 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-[#40CBB4]">
                  Mois 1 : Fondamentaux
                </h3>
                <p className="mt-4 text-gray-700 dark:text-white">
                  Maîtrisez les bases techniques de votre instrument. Travaillez
                  sur la posture, les exercices fondamentaux et les premières
                  notions théoriques essentielles pour progresser efficacement.
                </p>
              </div>

              {/* Mois 2 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-[#4C36A9]">
                  Mois 2 : Développement
                </h3>
                <p className="mt-4 text-gray-700 dark:text-white">
                  Approfondissez vos connaissances théoriques et votre
                  dextérité. Abordez des morceaux plus complexes et découvrez
                  les nuances d'interprétation qui font toute la différence.
                </p>
              </div>

              {/* Mois 3 */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-orange-500">
                  Mois 3 : Pratique Collective
                </h3>
                <p className="mt-4 text-gray-700 dark:text-white">
                  Mettez en application vos acquis dans un contexte de groupe.
                  Apprenez à jouer avec d'autres musiciens, à vous écouter
                  mutuellement et à créer une cohésion musicale.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Ressources pédagogiques */}
            <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-800 shadow-md dark:border-gray-700 dark:bg-gray-900">
              <p className="text-lg font-medium dark:text-white">
                🎓 Chaque participant reçoit un support pédagogique numérique
                complet :
              </p>

              <ul className=" mt-2 list-inside list-disc text-gray-700 dark:text-white">
                <li className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-green-500 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                  <span>Partitions</span>
                </li>
                <li className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-green-500 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                  <span>Exercices pratiques</span>
                </li>
                <li className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-green-500 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                  <span>Ressources théoriques</span>
                </li>
              </ul>

              <p className="mt-2 text-sm text-gray-600 dark:text-white">
                Pour approfondir les notions entre les sessions en direct et
                progresser de manière autonome.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="relative mx-auto flex items-center bg-[#F9FAFB] px-4 py-20 dark:bg-transparent"
        id="formations"
      >
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
                className="text-center font-light text-gray-800 dark:text-white"
              >
                Calendrier des prochaines sessions
              </Typography>
            </div>
          </motion.div>
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="my-10 flex justify-center">
                <Categories items={categories} />
              </div>
              {filteredMasterclasses.length !== 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMasterclasses.map((mc) => (
                    <div
                      key={mc.id}
                      className="relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-md dark:bg-gray-800"
                    >
                      {/* Image de fond */}
                      <div
                        className="relative h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${MasterclassImage}${mc.imageUrl})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/60" />

                        <div className="absolute bottom-2 left-2 z-10 flex w-full justify-between px-2 text-sm font-semibold text-white">
                          {new Date(mc.startDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </div>
                      </div>
                      {/* Contenu */}
                      <div className="flex flex-1 flex-col space-y-3 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                            {mc.title}
                          </h3>
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
              ) : (
                <section className="mb-12 flex flex-col items-center justify-center">
                  <p className="dark:text-white">
                    Pas de sessions disponibles pour le moment.
                  </p>
                </section>
              )}
              <div className="mt-12 flex justify-center">
                <Link to={`/masterclass`} className="rounded-full">
                  <Button className="dark:bg-white dark:text-black dark:hover:bg-gray-300">
                    Tous les cours en live
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="relative mx-auto flex items-center bg-[url('/img/bg-home-2.jpg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 py-20">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Contenu */}
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
              Blog & Ressources
            </Typography>
            <Typography variant="lead" className="mb-10 text-white">
              Explorez nos articles de blog et ressources pédagogiques pour
              approfondir vos connaissances musicales.
            </Typography>
          </motion.div>

          {/* Contenu détaillé en 3 colonnes */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Articles Spécialisés */}
            <div className="rounded-xl bg-white/10 p-6 text-white backdrop-blur-sm transition hover:bg-white/20">
              <h3 className="mb-2 text-xl font-semibold">
                Articles Spécialisés
              </h3>
              <p>
                Conseils techniques, analyses musicales et tendances actuelles
                pour enrichir votre culture musicale et améliorer votre pratique
                quotidienne.
              </p>
            </div>

            {/* Tutoriels Vidéo */}
            <div className="rounded-xl bg-white/10 p-6 text-white backdrop-blur-sm transition hover:bg-white/20">
              <h3 className="mb-2 text-xl font-semibold">Tutoriels Vidéo</h3>
              <p>
                Démonstrations pas à pas, exercices pratiques et analyses de
                morceaux célèbres pour compléter votre apprentissage principal.
              </p>
            </div>

            {/* Ressources Téléchargeables */}
            <div className="rounded-xl bg-white/10 p-6 text-white backdrop-blur-sm transition hover:bg-white/20">
              <h3 className="mb-2 text-xl font-semibold">
                Ressources Téléchargeables
              </h3>
              <p>
                Partitions, playbacks, fiches techniques et exercices exclusifs
                pour pratiquer efficacement entre vos sessions de cours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-28 px-4 py-20">
        <div className="container mx-auto max-w-screen-xl pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <PageTitle heading="Ce que propose Donymusic">
              Explorez les instruments et disciplines que nous enseignons. Que
              vous soyez passionné de rythme, de mélodie ou de chant, nos
              formations en direct sont faites pour vous.
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
                    <strong>Formation en ligne</strong> : Participez à des cours
                    en direct à des horaires définis, animés par nos
                    intervenants.
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

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Faq />
      </motion.div>
      {/* Contact Section */}
      {/* bg-[#F9FAFB] */}

      <section className="mx-auto px-4 py-20">
        <Contact />
      </section>
    </>
  );
}

export default Home;
