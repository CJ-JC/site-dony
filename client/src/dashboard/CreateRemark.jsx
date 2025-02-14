import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Remark from "./Remark";

const CreateRemark = ({ selectedVideo }) => {
  const { courseId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [createdRemark, setCreatedRemark] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    courseId: courseId,
    videoId: selectedVideo?.id,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/remark/create`,
        {
          ...inputs,
          userId: user.id,
          videoId: selectedVideo?.id,
          courseId: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCreatedRemark(response.data.data);
      setIsCreating(false);
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  return (
    <div className="h-[600px]">
      <div className="flex items-center justify-between font-medium">
        <Typography
          variant="h4"
          className="font-bold dark:text-white"
          color="blue-gray"
        >
          Question ?
        </Typography>

        <Button
          variant="gradient"
          size="sm"
          className="flex items-center"
          onClick={toggleCreating}
        >
          {isCreating ? (
            <>Annuler</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Poser une question
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <>
          <div className="my-4 p-4 text-sm text-blue-gray-500 dark:text-white">
            <strong>
              Conseils pour obtenir plus rapidement des réponses à vos questions
            </strong>
            <ul className="py-2">
              <li>
                - Faites une recherche pour vérifier si votre question a déjà
                été posée.
              </li>
              <li>- Donnez autant de détails que possible.</li>
              <li>- Vérifiez la grammaire et l&apos;orthographe.</li>
            </ul>
          </div>
          <div>
            <form
              className="mx-auto mb-2 w-80 max-w-screen-lg lg:w-1/2"
              onSubmit={handleSubmit}
            >
              <div className="mb-1 flex flex-col space-y-4">
                <div>
                  <label htmlFor="title">Titre</label>
                  <Input
                    size="lg"
                    className="dark:border-white dark:text-white"
                    id="title"
                    name="title"
                    placeholder="Titre de votre contenu..."
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="content">Contenu</label>
                  <Textarea
                    name="content"
                    onChange={handleChange}
                    id="content"
                    resize
                    placeholder="Votre contenu..."
                    required
                    className="dark:border-white dark:text-white"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
              </div>

              <Button
                className="dark:bg-white dark:text-black dark:hover:bg-gray-400"
                type="submit"
                fullWidth
              >
                Publier
              </Button>
            </form>
          </div>
        </>
      )}
      <Remark selectedVideo={selectedVideo} createdRemark={createdRemark} />
    </div>
  );
};

export default CreateRemark;
