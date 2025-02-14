import { Button, Textarea, Typography } from "@material-tailwind/react";
import axios from "axios";
import { Pencil, Trash, User2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Reply = ({
  remarkId,
  replyingRemarkId,
  setReplyingRemarkId,
  selectedVideo,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [error, setError] = useState(null);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchReply = async () => {
    if (selectedVideo) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/reply/video/${selectedVideo.id}`,
        );
        setReplies(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des remarques :", error);
      }
    }
  };
  useEffect(() => {
    fetchReply();
  }, [selectedVideo]);

  const handleReply = async (remarkId) => {
    setIsReplying(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/reply/create/${remarkId}`,
        {
          content: replyContent,
          userId: user.id,
          videoId: selectedVideo.id,
          remarkId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newReply = response.data?.data || response.data;

      setReplies((prevReplies) => [
        {
          ...newReply,
          createdAt: new Date().toISOString(),
          author: user,
        },
        ...prevReplies,
      ]);

      // Réinitialiser l'état
      setReplyingRemarkId(null);
      setReplyContent("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse :", error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleEditReply = async (replyId) => {
    try {
      await axios.put(
        `${BASE_URL}/api/reply/${replyId}`,
        {
          content: replyContent,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Mettre à jour localement la réponse modifiée
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.id === replyId ? { ...reply, content: replyContent } : reply,
        ),
      );

      // Réinitialiser l'état d'édition
      setEditingReplyId(null);
      setReplyContent("");
    } catch (error) {
      setError("Erreur lors de la modification de la réponse :", error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`${BASE_URL}/api/reply/delete/${replyId}`, {
        data: { userId: user.id, userRole: user.role },
      });
      // Supprimer la réponse localement
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.id !== replyId),
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la réponse :", error);
    }
  };

  const toggleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setReplyContent(reply.content);
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setReplyContent("");
  };

  const handleInputChange = (value) => {
    setReplyContent(value);
  };

  const sortedReplies = [...replies]
    .filter((reply) => reply.remarkId === remarkId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      {replyingRemarkId === remarkId && (
        <div className="mx-auto my-4 max-w-screen-lg lg:w-[75%] ">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)} // Corriger ici
            placeholder="Votre réponse..."
            resize
          />

          <div className="my-2 flex justify-end gap-x-3">
            <Button onClick={() => handleReply(remarkId)} disabled={isReplying}>
              {isReplying ? "Publication..." : "Publier"}
            </Button>

            <Button
              onClick={() => setReplyingRemarkId(null)}
              variant="outlined"
              className="text-black"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
      {sortedReplies.map((reply) => (
        <article
          key={reply.id}
          className="my-2 ml-6 rounded-lg p-2 text-base lg:ml-12"
        >
          {/* Rendu du contenu */}
          <footer className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black p-1 text-white dark:bg-white dark:text-black">
                <User2Icon className="h-10 w-10" />
              </div>
              <p className="font-bold">{reply.author?.firstName}</p>
              <p className="px-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                <time
                  dateTime={reply.createdAt}
                  title={new Date(reply.createdAt).toLocaleDateString("fr-FR")}
                >
                  {new Date(reply.createdAt).toLocaleDateString("fr-FR")}
                </time>
              </p>
            </div>
          </footer>
          {editingReplyId === reply.id ? (
            <>
              <div className="my-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                <div className="mt-2 flex justify-end gap-x-3">
                  <Button size="sm" onClick={() => handleEditReply(reply.id)}>
                    Modifier
                  </Button>
                  <Button
                    onClick={handleCancelEditReply}
                    variant="outlined"
                    size="sm"
                    className="bg-white text-black"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Typography className="whitespace-pre-wrap pt-2 font-medium text-gray-700 dark:text-white">
                {reply.content.trim()}
              </Typography>

              {user?.id === reply.userId && (
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => toggleEditReply(reply)}
                    type="button"
                    className="flex items-center gap-x-1 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                  >
                    <Pencil size={15} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteReply(reply.id)}
                    type="button"
                    className="flex items-center gap-x-1 text-sm font-medium text-red-500 hover:underline"
                  >
                    <Trash size={15} />
                    Supprimer
                  </button>
                </div>
              )}
            </>
          )}
        </article>
      ))}
    </div>
  );
};

export default Reply;
