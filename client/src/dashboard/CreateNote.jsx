import React, { useState } from "react";
import Note from "./Note";
import { Button, Textarea, Typography } from "@material-tailwind/react";
import { PlusCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateNote = ({ selectedVideo }) => {
  const { courseId } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [createdNote, setCreatedNote] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
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
      const response = await axios.post(`${BASE_URL}/api/note/create`, {
        ...inputs,
        userId: user.id,
        videoId: selectedVideo?.id,
        courseId: courseId,
      });

      const newNote = response.data;

      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setCreatedNote(newNote);
      setIsCreating(false);
    } catch (error) {
      setError(error.response?.data?.error || "Les champs sont obligatoires");
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
          Prendre des notes
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
              Prise de note
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <>
          <div>
            <form
              className="mx-auto mb-2 w-80 max-w-screen-lg lg:w-1/2"
              onSubmit={handleSubmit}
            >
              <div className="mb-1 flex flex-col space-y-4">
                <div>
                  <label htmlFor="content">Note</label>
                  <Textarea
                    name="content"
                    onChange={handleChange}
                    id="content"
                    resize
                    placeholder="Votre contenu..."
                    className="dark:border-white dark:text-white"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                </div>
              </div>

              <Button
                className="dark:bg-white dark:text-black dark:hover:bg-gray-400"
                type="submit"
                fullWidth
              >
                Créer la note
              </Button>
            </form>
          </div>
        </>
      )}
      <Note selectedVideo={selectedVideo} createdNote={createdNote} />
    </div>
  );
};

export default CreateNote;
