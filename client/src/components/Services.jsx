import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { FaRing } from "react-icons/fa";
import { Cake, Music4Icon, PartyPopperIcon, Stars, Truck } from "lucide-react";
import { PageTitle } from "@/widgets/layout";
import Select from "react-select";
import axios from "axios";

const Services = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eventType, setEventType] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [emailMessage, setEmailMessage] = useState({
    type: "",
    content: "",
  });

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: "#B0BEC5",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: "#B0BEC5",
      },
      backgroundColor: "transparent",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "gray",
    }),
    placeholder: (base) => ({
      ...base,
      color: "gray",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
    }),
  };

  const eventOptions = [
    { value: "Mariage", label: "Mariage" },
    { value: "Anniversaire", label: "Anniversaire" },
    { value: "Soirée privée", label: "Soirée privée" },
    { value: "Autre", label: "Autre" },
  ];

  const handleSelectChange = (selectedOption) => {
    setEventType(selectedOption ? selectedOption.value : "");
  };

  const sendEventEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/api/event/send-email`, {
        params: { email, firstName, lastName, eventType, message },
      });

      setEmailMessage({
        type: "success",
        content: response.data,
      });
      setEmail("");
      setMessage("");
      setFirstName("");
      setLastName("");
      setEventType("");
    } catch (error) {
      setEmailMessage({
        type: "danger",
        content: error.response.data,
      });
    }
  };

  return (
    <div className="text-gray-800 dark:bg-[#020818]">
      {/* Hero */}
      <div className="relative flex h-[700px] content-center items-center justify-center pb-32 pt-16">
        <video
          className="absolute top-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video/prestation.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 h-full w-full bg-black/85 bg-cover bg-center" />
        <div className="container relative mx-auto max-w-screen-xl">
          <div className="flex flex-wrap items-center">
            <div className="lg:w-8/10 w-full px-4 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  className="mb-2 text-3xl font-light md:text-5xl"
                >
                  Élevez vos Événements avec une Ambiance Musicale
                  Exceptionnelle
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="mt-4 dark:text-gray-300"
              >
                <Typography variant="lead" className="opacity-80">
                  Transformez vos moments précieux en souvenirs inoubliables
                  grâce à mes prestations musicales professionnelles pour
                  mariages, anniversaires et soirées privées. Une expérience sur
                  mesure qui s'adapte parfaitement à votre événement.
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <a href="#devis">
                  <Button
                    className="mt-4 bg-white text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    size="lg"
                  >
                    Demander un devis gratuit
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery / Services */}
      <section className="w-full dark:bg-transparent dark:text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mx-auto max-w-screen-xl px-4 py-20">
            <Typography
              variant="h2"
              className="mb-10 text-center text-3xl font-light"
            >
              Nos Offres pour vos Événements
            </Typography>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Mariage */}
              <motion.div
                className="relative h-64 overflow-hidden rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/img/wedding.jpg"
                  alt="Mariages"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
                  <h3 className="text-xl font-semibold">Mariages</h3>
                  <p className="mt-2 text-sm text-gray-100">
                    Une animation musicale complète pour sublimer chaque instant
                    de votre mariage : cérémonie émouvante, cocktail élégant et
                    soirée dansante festive, le tout orchestré pour sublimer
                    votre célébration.
                  </p>
                </div>
              </motion.div>

              {/* Anniversaire */}

              <motion.div
                className="relative h-64 overflow-hidden rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/img/birthday.jpg"
                  alt="Anniversaires"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
                  <h3 className="text-xl font-semibold">Anniversaires</h3>
                  <p className="mt-2 text-sm text-gray-100">
                    Créez un événement mémorable avec une musique qui reflète
                    vos goûts. Du jazz intimiste à la playlist festive, je
                    m'adapte à l'atmosphère souhaitée pour faire de votre
                    anniversaire un moment inoubliable.
                  </p>
                </div>
              </motion.div>

              {/* Soirée privée */}

              <motion.div
                className="relative h-64 overflow-hidden rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/img/party.jpg"
                  alt="Soirées Privées"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
                  <h3 className="text-xl font-semibold">Soirées Privées</h3>
                  <p className="mt-2 text-sm text-gray-100">
                    Un répertoire éclectique, du classique au contemporain,
                    adapté à vos événements (garden-party ou soirées à thème),
                    en version acoustique ou amplifiée selon vos envies.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="mx-auto  bg-[#F9FAFB] px-4 py-20 dark:bg-transparent dark:text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            className="mb-10 text-center text-3xl font-light"
          >
            Pourquoi nous choisir ?
          </Typography>

          <div className="mx-auto max-w-screen-xl px-4">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-4">
              {/* Colonne de texte */}
              <div className="order-1 col-span-1 lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Bloc 1 */}
                  <div className="mb-4 flex items-start space-x-3">
                    <div>
                      <Stars className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Excellence garantie
                      </h3>
                      <p className="text-md text-gray-700 dark:text-white">
                        Votre satisfaction est ma priorité. On s'engage à vous
                        offrir une expérience musicale exceptionnelle.
                      </p>
                    </div>
                  </div>

                  {/* Bloc 2 */}
                  <div className="mb-4 flex items-start space-x-3">
                    <div>
                      <Music4Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Personnalisation totale
                      </h3>
                      <p className="text-md text-gray-700 dark:text-white">
                        Chaque programme musical est élaboré sur mesure avec
                        vous, en tenant compte de vos préférences et du rythme
                        souhaité pour votre événement.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Bloc 3 */}
                <div className="flex items-start space-x-3">
                  <div>
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Service complet</h3>
                    <p className="text-md text-gray-700 dark:text-white">
                      Équipement professionnel de qualité, installation discrète
                      et rapide, disponibilité en Île-de-France et régions
                      limitrophes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image responsive */}
              <div className="order-2 col-span-1 lg:order-1 lg:col-span-2">
                <div className="group relative block h-[300px] w-full overflow-hidden rounded-lg sm:h-[400px] lg:h-full">
                  <video
                    src="/video/presta.mp4"
                    poster="/img/fete.jpg"
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="aspect-video w-full rounded-xl object-cover shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Offers */}
      <section className="w-full dark:bg-transparent dark:text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mx-auto max-w-screen-xl px-4 py-20 dark:text-white">
            <Typography
              variant="h2"
              className="mb-10 text-center text-3xl font-light"
            >
              Tarifs et Formules
            </Typography>

            <div className="mx-auto max-w-7xl px-4 pt-0 sm:px-6 lg:px-8 lg:pt-20">
              <ul className="relative mx-auto mt-28 grid max-w-5xl grid-cols-1 gap-16 px-4 sm:grid-cols-1 lg:grid-cols-3 lg:gap-10">
                {/* Trait horizontal (desktop) */}
                <div className="absolute left-1/2 top-6 hidden h-0.5 w-[100%] -translate-x-1/2 bg-gray-300 lg:block"></div>

                {/* Mariage - texte en haut sur desktop, normal sur mobile */}
                <li className="relative flex flex-col items-center text-center">
                  <div className="hidden lg:absolute lg:-top-36 lg:block lg:w-[30rem]">
                    <h3 className="text-xl font-semibold">
                      💍 Mariage Complet
                    </h3>
                    <p className="mt-1 text-base text-gray-700 dark:text-white">
                      Une prestation musicale sur mesure pour votre cérémonie,
                      vin d’honneur, ou soirée dansante.{" "}
                      <strong>Options disponibles : </strong>
                      ouverture de bal, animation live, duo de musiciens, etc.{" "}
                      <br />
                      💬 Tarif personnalisé sur demande de devis.
                    </p>
                  </div>
                  <div className="z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200 dark:text-black">
                    <FaRing />
                  </div>
                  <div className="mt-6 w-[30rem] lg:hidden">
                    <h3 className="text-xl font-semibold">
                      💍 Mariage Complet
                    </h3>
                    <p className="mt-1 text-base text-gray-700 dark:text-white">
                      Une prestation musicale sur mesure pour votre cérémonie,
                      vin d’honneur, ou soirée dansante. Options disponibles :
                      ouverture de bal, animation live, duo de musiciens, etc.{" "}
                      <br />
                      💬 Tarif personnalisé sur demande de devis.
                    </p>
                  </div>
                </li>

                {/* Anniversaire - toujours centré */}
                <li className="relative flex flex-col items-center text-center">
                  <div className="z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200 dark:text-black">
                    <Cake />
                  </div>
                  <div className="mt-6 w-[30rem]">
                    <h3 className="text-xl font-semibold">
                      🎉 Anniversaire & Événements Privés
                    </h3>
                    <p className="mt-1 text-base text-gray-700 dark:text-white">
                      Ambiance festive, concert live ou DJ set selon vos envies.
                      Possibilité de duo musical ou animations spécifiques.{" "}
                      <br />
                      💬 Tarif sur mesure en fonction des options choisies lors
                      de la demande de devis.
                    </p>
                  </div>
                </li>

                {/* Soirée privée - texte en haut sur desktop, normal sur mobile */}
                <li className="relative flex flex-col items-center text-center">
                  <div className="hidden lg:absolute lg:-top-32 lg:block lg:w-[30rem]">
                    <h3 className="text-xl font-semibold">
                      🌙 Soirée Privée / Corporate
                    </h3>
                    <p className="mt-1 text-base text-gray-700 dark:text-white">
                      Musique live ou DJ set adapté à votre événement. <br />{" "}
                      Style musical, durée et équipe entièrement
                      personnalisables. <br />
                      💬 Tarif établi après échange via demande de devis.
                    </p>
                  </div>
                  <div className="z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200 dark:text-black">
                    <PartyPopperIcon />
                  </div>
                  <div className="mt-6 w-[30rem] lg:hidden">
                    <h3 className="text-xl font-semibold">
                      🌙 Soirée Privée / Corporate
                    </h3>
                    <p className="mt-1 text-base text-gray-700 dark:text-white">
                      Musique live ou DJ set adapté à votre événement. Style
                      musical, durée et équipe entièrement personnalisables.{" "}
                      <br />
                      💬 Tarif établi après échange via demande de devis.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* contact */}
      <section className="relative mx-auto flex items-center bg-[url('/img/devis.jpg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 py-20">
        <div className="absolute inset-0 bg-black/80" />

        <div className="container relative z-10 mx-auto max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              className="mb-10 text-center text-3xl font-light text-white"
            >
              Réservation
            </Typography>

            <div className="grid gap-6 lg:grid-cols-3">
              <div>
                <div className="space-y-6 lg:mt-24">
                  <div className="rounded-xl bg-orange-500/50 p-4 text-white">
                    <h3 className="text-xl font-semibold">
                      📝 Demande de Devis
                    </h3>
                    <p className="text-base font-light">
                      Remplissez le formulaire en ligne avec les infos clés
                      (date, lieu, type d’événement, ambiance souhaitée). <br />{" "}
                      → Vous recevez une proposition personnalisée sous 24h.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-6 lg:mt-12">
                  <div className="rounded-xl bg-purple-500/40 p-4 text-white">
                    <h3 className="text-xl font-semibold">
                      🎵Consultation Musicale
                    </h3>
                    <p className="font-light">
                      Un échange rapide pour cerner vos goûts, préférences et
                      objectifs. <br /> → On construit ensemble l’ambiance
                      parfaite pour votre événement.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-6 lg:mt-0">
                  <div className="rounded-xl bg-green-500/40 p-4 text-white">
                    <h3 className="text-xl font-semibold">
                      ✅ Confirmation de Réservation
                    </h3>
                    <p className="font-light">
                      Une fois les détails validés, un acompte permet de bloquer
                      la date. <br />→ Le solde est à régler une semaine avant
                      l’événement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* devis */}
      <section className="mx-auto max-w-screen-xl px-4 pb-20" id="devis">
        <div className="container mx-auto dark:text-white">
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="px-4 pb-5 pt-20 text-center">
              <PageTitle heading="Intéressé par une prestation ?">
                Remplissez le formulaire ci-dessous pour discuter de votre
                événement. <br /> Nous reviendrons vers vous rapidement.
              </PageTitle>
            </div>
          </motion.div>

          {/* Formulaire de contact */}
          <div className="mx-auto max-w-3xl px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form
                className="space-y-6 rounded-lg bg-white p-0 dark:bg-transparent md:p-6 md:shadow-md"
                onSubmit={sendEventEmail}
              >
                {emailMessage?.content && (
                  <div
                    role="alert"
                    className={`relative mb-4 flex w-full items-start rounded-md p-3 text-sm text-white ${
                      emailMessage.type === "success"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    <span className="pr-8">{emailMessage.content}</span>

                    <button
                      onClick={() => setEmailMessage({ type: "", content: "" })}
                      className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md text-white transition-all hover:bg-white/10 active:bg-white/10"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-5 w-5"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex flex-col justify-center gap-4 md:flex-row">
                  <div className="w-full">
                    <label htmlFor="lastname">Nom</label>
                    <Input
                      variant="outlined"
                      size="lg"
                      name="lastname"
                      placeholder="Nom"
                      id="lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="dark:text-white dark:focus:border-b-white"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="firstname">Prénom</label>
                    <Input
                      variant="outlined"
                      size="lg"
                      name="firstname"
                      placeholder="Nom complet"
                      id="firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="dark:text-white dark:focus:border-b-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <Input
                    variant="outlined"
                    size="lg"
                    name="email"
                    placeholder="email@exemple.com"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dark:text-white dark:focus:border-b-white"
                  />
                </div>

                <div>
                  <label htmlFor="eventType">Type d’événement</label>
                  <Select
                    id="eventType"
                    options={eventOptions}
                    onChange={handleSelectChange}
                    value={
                      eventType
                        ? eventOptions.find((opt) => opt.value === eventType)
                        : null
                    }
                    className="dark:text-white"
                    placeholder="Sélectionner"
                    styles={customStyles}
                    isClearable
                  />
                </div>

                <div>
                  <label htmlFor="message">Détails / Demande spécifique</label>
                  <Textarea
                    variant="outlined"
                    size="lg"
                    placeholder="Décrivez votre événement, vos attentes, etc."
                    id="message"
                    rows={8}
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="dark:text-white dark:focus:border-b-white"
                    labelProps={{
                      style: { color: "white" },
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  className="mt-4 dark:bg-white dark:text-black dark:hover:bg-gray-300"
                  fullWidth
                >
                  Envoyer ma demande
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
