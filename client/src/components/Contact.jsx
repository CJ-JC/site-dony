import { PageTitle } from "@/widgets/layout";
import { Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fullname, setFullname] = useState("");
  const [subject, setSubject] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [emailMessage, setEmailMessage] = useState({
    type: "",
    content: "",
  });

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/api/email/send-email`, {
        params: { email, fullname, subject, message },
      });

      setEmailMessage({
        type: "success",
        content: response.data,
      });
      setEmail("");
      setMessage("");
      setFullname("");
      setSubject("");
    } catch (error) {
      setEmailMessage({
        type: "danger",
        content: error.response.data,
      });
    }
  };

  return (
    <div className="container mx-auto dark:text-white">
      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <div className=" px-4 pb-5 text-center ">
          <PageTitle
            section="Contactez-nous"
            heading="Une demande à nous adresser ?"
          >
            Remplissez ce formulaire ci-dessous et nous reviendrons vers vous
            rapidement.
          </PageTitle>
        </div>
      </motion.div>

      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form
            className="space-y-6 rounded-lg bg-white p-0 dark:bg-transparent md:p-6 md:shadow-md"
            onSubmit={sendEmail}
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
            <div className="mb-8 flex flex-col justify-center gap-4 md:flex-row">
              <div className="w-full">
                <label htmlFor="fullname">Nom complet</label>
                <Input
                  variant="outlined"
                  size="lg"
                  name="fullname"
                  placeholder="Nom complet"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="dark:text-white dark:focus:border-b-white"
                />
              </div>
              <div className="w-full">
                <label htmlFor="email">Adresse email</label>
                <Input
                  variant="outlined"
                  size="lg"
                  placeholder="Adresse email"
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:text-white dark:focus:border-b-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject">Sujet</label>
              <Input
                variant="outlined"
                size="lg"
                placeholder="Sujet de votre message"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="dark:text-white dark:focus:border-b-white"
              />
            </div>
            <div>
              <label htmlFor="message">Votre message</label>
              <Textarea
                variant="outlined"
                size="lg"
                placeholder="Votre message"
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
              Envoyer le message
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
