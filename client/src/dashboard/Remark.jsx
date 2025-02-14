import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  MessageSquareText,
  Pencil,
  Trash,
  User2Icon,
} from "lucide-react";
import { useSelector } from "react-redux";
import Reply from "./Reply";

const Remark = ({ selectedVideo, createdRemark }) => {
  const [remarks, setRemarks] = useState([]);
  const [isContentVisible, setIsContentVisible] = useState({});
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [replyingRemarkId, setReplyingRemarkId] = useState(null);
  const [replies, setReplies] = useState([]);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchRemarks = async () => {
    if (selectedVideo) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/remark/video/${selectedVideo.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRemarks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des remarques :", error);
      }
    }
  };

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
    fetchRemarks();
  }, [selectedVideo]);

  useEffect(() => {
    if (createdRemark) {
      setRemarks((prevRemarks) => [createdRemark, ...prevRemarks]);
    }
  }, [createdRemark]);

  const handleEdit = async (remarkId) => {
    try {
      const remarkToUpdate = remarks.find((remark) => remark.id === remarkId);
      await axios.put(`${BASE_URL}/api/remark/${remarkId}`, {
        title: remarkToUpdate.title,
        content: remarkToUpdate.content,
      });

      setEditingRemarkId(null);
      fetchRemarks();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  const handleDelete = async (remarkId) => {
    try {
      await axios.delete(`${BASE_URL}/api/remark/delete/${remarkId}`, {
        data: { userId: user.id, userRole: user.role },
      });
      // Supprimer la remarque localement
      setRemarks((prevRemarks) =>
        prevRemarks.filter((remark) => remark.id !== remarkId),
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la remarque :", error);
    }
  };

  const handleInputChange = (remarkId, field, value) => {
    setRemarks((prevRemarks) =>
      prevRemarks.map((remark) =>
        remark.id === remarkId ? { ...remark, [field]: value } : remark,
      ),
    );
  };

  const toggleEdit = (remarkId) => {
    setEditingRemarkId(remarkId);
    setReplyingRemarkId(null);
  };

  const toggleReply = (remarkId) => {
    setReplyingRemarkId(remarkId);
    setEditingRemarkId(null);
  };

  const toggleContentVisibility = (remarkId) => {
    setIsContentVisible((prev) => ({ ...prev, [remarkId]: !prev[remarkId] }));
  };

  const sortedRemarks = remarks.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="container mx-auto max-w-screen-xl">
      <div className="remarks-list mb-10 pb-10">
        {sortedRemarks.map((remark) => (
          <article
            key={remark.id}
            className="gray-200 my-3 w-full border-b py-2 text-base dark:border-gray-700"
          >
            <footer className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black p-1 text-white dark:bg-white dark:text-black">
                  <User2Icon className="h-10 w-10" />
                </div>

                <p className="text-sm font-medium">
                  {remark.author?.firstName}
                </p>
                <p className="px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <time
                    dateTime={remark.createdAt}
                    title={new Date(remark.createdAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  >
                    {new Date(remark.createdAt).toLocaleDateString("fr-FR")}
                  </time>
                </p>
              </div>

              <button
                onClick={() => toggleContentVisibility(remark.id)}
                className="text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
              >
                {isContentVisible[remark.id] ? (
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

            {editingRemarkId === remark.id ? (
              <div className="flex flex-col gap-y-4 p-4">
                <Input
                  value={remark.title}
                  onChange={(e) =>
                    handleInputChange(remark.id, "title", e.target.value)
                  }
                  className="mb-2 text-blue-gray-900"
                />
                <Textarea
                  name="content"
                  resize
                  value={remark.content}
                  onChange={(e) =>
                    handleInputChange(remark.id, e.target.name, e.target.value)
                  }
                />
                <div className="flex justify-end gap-x-3">
                  <Button size="sm" onClick={() => handleEdit(remark.id)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => setEditingRemarkId(null)}
                    className="text-black"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="pt-2 font-bold">{remark.title}</p>
                <div className="text-gray-500 dark:text-gray-400">
                  {isContentVisible[remark.id] ? (
                    <Typography className="whitespace-pre-wrap font-medium text-gray-700 dark:text-white">
                      {remark.content.trim()}
                    </Typography>
                  ) : (
                    <Typography className="whitespace-pre-wrap font-medium text-gray-700 dark:text-white">
                      {remark.content.length > 180
                        ? remark.content.substring(0, 180) + "..."
                        : remark.content}
                    </Typography>
                  )}
                </div>
                <div className="my-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {replies.filter((reply) => reply.remarkId === remark.id)
                    .length > 0 && (
                    <p>
                      {
                        replies.filter((reply) => reply.remarkId === remark.id)
                          .length
                      }{" "}
                      {replies.filter((reply) => reply.remarkId === remark.id)
                        .length > 1
                        ? "réponses"
                        : "réponse"}
                    </p>
                  )}
                </div>
              </>
            )}

            {isContentVisible[remark.id] && (
              <>
                <div className="flex items-center space-x-4">
                  <button
                    size="sm"
                    type="button"
                    className="flex items-center gap-x-1 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                    onClick={() => toggleReply(remark.id)}
                  >
                    <MessageSquareText size={15} />
                    Répondre
                  </button>
                  {(user?.id === remark.userId || user?.role === "admin") && (
                    <>
                      {user?.id === remark.userId && (
                        <button
                          size="sm"
                          onClick={() => toggleEdit(remark.id)}
                          type="button"
                          className="flex items-center gap-x-1 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                        >
                          <Pencil size={15} />
                          Modifier
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(remark.id)}
                        type="button"
                        className="flex items-center gap-x-1 text-sm font-medium text-red-500 hover:underline"
                      >
                        <Trash size={15} />
                        Supprimer
                      </button>
                    </>
                  )}
                </div>

                <Reply
                  remarkId={remark.id}
                  selectedVideo={selectedVideo}
                  replyingRemarkId={replyingRemarkId}
                  setReplyingRemarkId={setReplyingRemarkId}
                />
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default Remark;
