import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { PlusCircle, Trash2, Paperclip } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const CreateChapter = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    courseId: courseId,
    videos: [],
  });

  // État pour gérer plusieurs vidéos avec leurs annexes
  const [videos, setVideos] = useState([
    {
      title: "",
      url: "",
    },
  ]);

  // État pour gérer les annexes
  const [attachments, setAttachments] = useState([
    {
      title: "",
      file: null,
      videoId: "",
    },
  ]);

  const handleChapterChange = (e) => {
    setChapterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoChange = (index, e) => {
    const newVideos = [...videos];
    newVideos[index][e.target.name] = e.target.value;
    setVideos(newVideos);
  };

  const handleAttachmentChange = (index, e) => {
    const newAttachments = [...attachments];
    if (e.target.type === "file") {
      newAttachments[index].file = e.target.files[0];
    } else if (e.target.name === "videoId") {
      newAttachments[index].videoId = e.target.value;
    } else {
      newAttachments[index].title = e.target.value;
    }
    setAttachments(newAttachments);
  };

  const handleAddVideo = () => {
    setVideos([...videos, { title: "", url: "" }]);
  };

  const handleAddAttachment = () => {
    setAttachments([...attachments, { title: "", file: null, videoId: "" }]);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validVideos = videos.filter((video) => video.title && video.url);
    if (validVideos.length === 0) {
      setError("Au moins une vidéo avec un titre et une URL est requise");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", chapterData.title);
    formData.append("description", chapterData.description);
    formData.append("courseId", chapterData.courseId);
    formData.append("videos", JSON.stringify(validVideos));

    // Ajouter les fichiers d'annexe au formData avec leurs videoId
    attachments.forEach((attachment, index) => {
      if (attachment.file) {
        formData.append(`attachments`, attachment.file);
        formData.append(`videoId${index}`, attachment.videoId || "");
      }
    });

    try {
      await axios.post(`${BASE_URL}/api/chapter/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/administrator/edit-course/${courseId}`);
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-6">
      <div className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-layout-dashboard h-8 w-8 text-green-700"
          >
            <rect width="7" height="9" x="3" y="3" rx="1"></rect>
            <rect width="7" height="5" x="14" y="3" rx="1"></rect>
            <rect width="7" height="9" x="14" y="12" rx="1"></rect>
            <rect width="7" height="5" x="3" y="16" rx="1"></rect>
          </svg>
        </div>
        <h2 className="text-xl">Mise en place du chapitre</h2>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-md border p-4">
            <Input
              type="text"
              id="title"
              name="title"
              value={chapterData.title}
              onChange={handleChapterChange}
              label="Titre du chapitre"
              className="dark:text-white dark:focus:border-white"
              required
            />
          </div>
          <div className="space-y-2 rounded-md border p-4">
            <label
              htmlFor="description"
              className="text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Description du chapitre
            </label>
            <Editor
              name="description"
              value={chapterData.description}
              onChange={handleChapterChange}
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video h-8 w-8 text-green-700"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
            </div>
            <h2 className="text-xl">Mise en place des vidéos</h2>
          </div>
          <Button
            variant="gradient"
            type="button"
            onClick={handleAddVideo}
            className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-400"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter des vidéos
          </Button>
        </div>

        {videos.map((video, index) => (
          <div key={index} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2 rounded-md border p-4">
                <Input
                  label="Titre de la vidéo"
                  required
                  name="title"
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, e)}
                  type="text"
                  className="dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="relative space-y-2 rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Input
                    label="Vidéo aperçu de la formation"
                    required
                    name="url"
                    value={video.url}
                    onChange={(e) => handleVideoChange(index, e)}
                    type="text"
                    className="dark:text-white dark:focus:border-white"
                  />
                  {videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-10 flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
              <Paperclip className="h-8 w-8 text-green-700" />
            </div>
            <h2 className="text-xl">Annexes du chapitre</h2>
          </div>
          <Button
            variant="gradient"
            type="button"
            onClick={handleAddAttachment}
            className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une annexe
          </Button>
        </div>

        {attachments.map((attachment, index) => (
          <div key={index} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative space-y-2 rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Input
                    label="Fichier annexe"
                    name="file"
                    type="file"
                    onChange={(e) => handleAttachmentChange(index, e)}
                    className="dark:text-white dark:focus:border-white"
                  />
                  {attachments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2 rounded-md border p-4">
                <select
                  name="videoId"
                  value={attachment.videoId}
                  onChange={(e) => handleAttachmentChange(index, e)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sélectionner la vidéo (optionnel)</option>
                  {videos.map((video, videoIndex) => (
                    <option key={videoIndex} value={videoIndex}>
                      {video.title || `Vidéo ${videoIndex + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <Button
            type="submit"
            className="mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer le chapitre"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateChapter;
