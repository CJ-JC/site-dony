import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Comment se déroulent les cours en direct ?",
    answer:
      "Les cours sont dispensés via visioconférence à des horaires définis. Vous interagissez en temps réel avec le formateur et les autres participants.",
  },
  {
    question: "Dois-je avoir un niveau minimum pour commencer ?",
    answer:
      "Pas du tout ! Nos formations sont ouvertes à tous les niveaux, du grand débutant au musicien confirmé.",
  },
  {
    question: "Puis-je accéder aux ressources après les sessions ?",
    answer:
      "Oui, chaque participant reçoit un support pédagogique numérique : partitions, exercices, et ressources théoriques à télécharger.",
  },
  {
    question: "Quel matériel dois-je avoir pour suivre les cours ?",
    answer:
      "Un instrument de musique, une connexion internet stable et un ordinateur ou smartphone avec webcam suffisent.",
  },
  {
    question: "Comment s'inscrire à une session ?",
    answer:
      "Rendez-vous sur la page des sessions, choisissez celle qui vous intéresse, puis cliquez sur “S’inscrire”.",
  },
];

const Faq = () => {
  const [openStates, setOpenStates] = useState(
    Array(faqData.length).fill(false),
  );

  const toggle = (index) => {
    const updated = [...openStates];
    updated[index] = !updated[index];
    setOpenStates(updated);
  };

  return (
    <section className="mx-auto bg-[#F9FAFB] px-4 py-20 dark:bg-transparent">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Foire aux questions
        </h2>
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-md dark:bg-gray-800"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between text-left text-lg font-semibold text-gray-800 dark:text-white"
              >
                {item.question}
                <span className="ml-4 text-xl">
                  {openStates[index] ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {openStates[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
