import { PageTitle } from "@/widgets/layout";
import { Alert, Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fullname, setFullname] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [emailMessage, setEmailMessage] = useState({
    type: "",
    content: "",
  });

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/api/email/send-email`, {
        params: { email, fullname, message },
      });

      setEmailMessage({
        type: "success",
        content: response.data,
      });
      setEmail("");
      setMessage("");
      setFullname("");
    } catch (error) {
      setEmailMessage({
        type: "danger",
        content: error.response.data,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <PageTitle
        section="Contactez-nous"
        heading="Une demande à nous adresser ?"
      >
        Remplissez ce formulaire et nous vous répondrons sous 24 heures.
      </PageTitle>
      <form className="mx-auto mt-12 w-full lg:w-5/12" onSubmit={sendEmail}>
        {emailMessage?.content && (
          <Alert
            color={emailMessage.type === "success" ? "green" : "red"}
            className="mb-4"
          >
            {emailMessage.content}
          </Alert>
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
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:text-white dark:focus:border-b-white"
            />
          </div>
        </div>
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
        <Button
          type="submit"
          size="md"
          className="mt-4 dark:bg-white dark:text-black dark:hover:bg-gray-400"
          fullWidth
        >
          Envoyer le message
        </Button>
      </form>
    </div>
  );
};

export default Contact;
