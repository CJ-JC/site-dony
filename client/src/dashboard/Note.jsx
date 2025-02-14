import { Button, Textarea, Typography } from "@material-tailwind/react";
import axios from "axios";
import { Eye, EyeOff, Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Note = ({ selectedVideo, createdNote }) => {
  const [notes, setNotes] = useState([]);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isContentVisible, setIsContentVisible] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchNotes = async () => {
    if (courseId) {
      try {
        const response = await axios.get(`${BASE_URL}/api/note/notes`, {
          params: {
            userId: user.id,
            courseId: courseId,
          },
        });

        setNotes(response.data);
      } catch (error) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [courseId, user]);

  useEffect(() => {
    if (createdNote) {
      setNotes((prevNotes) => [createdNote, ...prevNotes]);
    }
  }, [createdNote]);

  const toggleEdit = (noteId) => {
    setEditingNoteId(noteId);
  };

  const handleEdit = async (noteId) => {
    try {
      const noteToUpdate = notes.find((note) => note.id === noteId);
      await axios.put(`${BASE_URL}/api/note/${noteId}`, {
        content: noteToUpdate.content,
      });

      setEditingNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  const handleInputChange = (noteId, field, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, [field]: value } : note,
      ),
    );
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${BASE_URL}/api/note/delete/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      setError(error);
    }
  };

  const toggleContentVisibility = (noteId) => {
    setIsContentVisible((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const sortedNotes = notes.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="container mx-auto max-w-screen-xl">
      <div className="notes-list mb-10 pb-10">
        {sortedNotes.map((note) => (
          <article
            key={note.id}
            className="gray-200 my-3 w-full border-b py-2 text-base dark:border-gray-700"
          >
            <footer className="flex items-start justify-between">
              <div className="flex items-center">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  <time
                    dateTime={note.createdAt}
                    title={new Date(note.createdAt).toLocaleDateString("fr-FR")}
                  >
                    {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                  </time>
                </p>
              </div>

              <button
                onClick={() => toggleContentVisibility(note.id)}
                className="text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
              >
                {isContentVisible[note.id] ? (
                  <div title="Cacher le contenu">
                    <EyeOff className="h-5 w-5" />
                  </div>
                ) : (
                  <div title="Afficher le contenu">
                    <Eye className="h-5 w-5" />
                  </div>
                )}
              </button>
            </footer>

            {editingNoteId === note.id ? (
              <div className="flex flex-col gap-y-4 p-4">
                <Textarea
                  name="content"
                  value={note.content}
                  resize
                  onChange={(e) =>
                    handleInputChange(note.id, e.target.name, e.target.value)
                  }
                />
                <div className="flex justify-end gap-x-3">
                  <Button size="sm" onClick={() => handleEdit(note.id)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => setEditingNoteId(null)}
                    className="text-black"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="pt-2 font-bold">{note.title}</p>
                <div className="my-2 text-gray-500 dark:text-gray-400">
                  {isContentVisible[note.id] ? (
                    <Typography className="whitespace-pre-wrap font-medium text-gray-700 dark:text-white">
                      {note.content.trim()}
                    </Typography>
                  ) : (
                    <Typography className="whitespace-pre-wrap font-medium text-gray-700 dark:text-white">
                      {note.content.length > 180
                        ? note.content.substring(0, 180) + "..."
                        : note.content}
                    </Typography>
                  )}
                </div>
              </>
            )}
            {isContentVisible[note.id] && (
              <>
                <div className="flex items-center space-x-4">
                  {user?.id === note.userId && (
                    <>
                      <button
                        size="sm"
                        onClick={() => toggleEdit(note.id)}
                        type="button"
                        className="flex items-center gap-x-1 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                      >
                        <Pencil size={15} />
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        type="button"
                        className="flex items-center gap-x-1 text-sm font-medium text-red-500 hover:underline"
                      >
                        <Trash size={15} />
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default Note;
