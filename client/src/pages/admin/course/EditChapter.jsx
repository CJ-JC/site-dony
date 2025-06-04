import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Paperclip, PlusCircle, Trash2, TrashIcon } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const EditChapter = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const navigate = useNavigate();
  const { id, courseId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    courseId: courseId,
    videos: [],
    attachments: [],
  });

  // État pour gérer plusieurs vidéos
  const [videos, setVideos] = useState([
    {
      title: "",
      url: "",
      attachments: [],
      newAttachments: [],
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

  // Récupérer les données du chapitre et ses vidéos
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/chapter/${id}`);
        const { title, description } = response.data;

        setChapterData({
          title,
          description,
          courseId,
          attachments,
        });

        // Si des vidéos existent, les charger avec leurs annexes
        if (response.data.videos && response.data.videos.length > 0) {
          setVideos(
            response.data.videos.map((video) => ({
              id: video.id,
              title: video.title,
              url: video.url,
              attachments: video.attachments || [],
              newAttachments: [],
            })),
          );
        }
      } catch (error) {
        setError("Erreur lors de la récupération du chapitre");
      }
    };

    fetchChapterData();
  }, [id, courseId]);

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

  const handleAddVideo = () => {
    setVideos([
      ...videos,
      { title: "", url: "", attachments: [], newAttachments: [] },
    ]);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleAddAttachment = (videoIndex) => {
    const newVideos = [...videos];
    if (!newVideos[videoIndex].newAttachments) {
      newVideos[videoIndex].newAttachments = [];
    }
    newVideos[videoIndex].newAttachments.push({ file: null });
    setVideos(newVideos);
  };

  const handleRemoveAttachment = (videoIndex, attachmentIndex) => {
    const newVideos = [...videos];
    newVideos[videoIndex].newAttachments = newVideos[
      videoIndex
    ].newAttachments.filter((_, i) => i !== attachmentIndex);
    setVideos(newVideos);
  };

  const handleAttachmentChange = (videoIndex, attachmentIndex, e) => {
    const newVideos = [...videos];
    if (!newVideos[videoIndex].newAttachments) {
      newVideos[videoIndex].newAttachments = [];
    }
    if (e.target.type === "file") {
      newVideos[videoIndex].newAttachments[attachmentIndex].file =
        e.target.files[0];
    }
    setVideos(newVideos);
  };

  const handleRemoveExistingAttachment = async (videoIndex, attachmentId) => {
    try {
      await axios.delete(`${BASE_URL}/api/attachment/delete/${attachmentId}`);

      // Mettre à jour l'état local après la suppression
      const newVideos = [...videos];
      newVideos[videoIndex].attachments = newVideos[
        videoIndex
      ].attachments.filter((attachment) => attachment.id !== attachmentId);
      setVideos(newVideos);
    } catch (error) {
      setError("Erreur lors de la suppression de l'annexe");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Filtrer les vidéos valides
    const validVideos = videos.filter((video) => video.title && video.url);
    if (validVideos.length === 0) {
      setError("Au moins une vidéo avec un titre et une URL est requise");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", chapterData.title);
    formData.append("description", chapterData.description);
    formData.append("courseId", courseId);
    formData.append("videos", JSON.stringify(validVideos));

    let fileIndex = 0;

    videos.forEach((video, videoIndex) => {
      if (video.newAttachments) {
        video.newAttachments.forEach((attachment) => {
          if (attachment.file) {
            formData.append(`attachments`, attachment.file);
            formData.append(`videoId${fileIndex}`, videoIndex);
            fileIndex++;
          }
        });
      }
    });

    try {
      await axios.put(`${BASE_URL}/api/chapter/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/administrator/edit-course/${courseId}`);
    } catch (error) {
      console.error("Erreur complète:", error);
      setError(
        error.response?.data?.error ||
          "Une erreur est survenue lors de la mise à jour",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
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
        <h2 className="text-xl">Modification du chapitre</h2>
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
              label="Titre du chapitre"
              type="text"
              id="title"
              name="title"
              value={chapterData.title}
              onChange={handleChapterChange}
              required
              className="dark:text-white dark:focus:border-white"
            />
          </div>
          <div className="space-y-2 rounded-md border p-4">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900 dark:text-white"
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
            <h2 className="text-xl">Modification des vidéos</h2>
          </div>
          <button
            type="button"
            onClick={handleAddVideo}
            className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none dark:bg-white dark:text-black"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter des vidéos
          </button>
        </div>

        {videos.map((video, index) => (
          <div
            key={index}
            className="mt-6 grid grid-cols-1 gap-6 bg-white p-2 dark:bg-transparent md:grid-cols-2"
          >
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
                  label="URL de la vidéo"
                  required
                  name="url"
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, e)}
                  type="text"
                  className="dark:text-white dark:focus:border-white"
                />

                {/* <input
                  type="file"
                  accept="video/*"
                  className="block w-full cursor-pointer text-sm file:mr-2 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none dark:text-white dark:file:bg-gray-700 dark:file:text-white"
                /> */}
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
            {/* Section des annexes */}
            <div className="col-span-2 rounded-md border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">
                    Annexes de la vidéo
                  </span>
                </div>
                <Button
                  variant="gradient"
                  type="button"
                  onClick={() => handleAddAttachment(index)}
                  className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter une annexe
                </Button>
              </div>

              {/* Liste des annexes existantes */}
              {video.attachments && video.attachments.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h4 className="text-sm font-medium">Annexes existantes :</h4>
                  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {video.attachments.map((attachment, attachmentIndex) => (
                      <div
                        key={attachmentIndex}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <a
                            href={`${CoursesImage}${attachment.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
                            download
                          >
                            {attachment.title}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`${CoursesImage}${attachment.fileUrl}`}
                            download
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-download"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveExistingAttachment(
                                index,
                                attachment.id,
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire d'ajout d'annexe */}
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {video.newAttachments &&
                  video.newAttachments.map((attachment, attachmentIndex) => (
                    <div key={attachmentIndex} className="mb-4">
                      <div className="flex items-center gap-1 rounded-md border p-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            handleAttachmentChange(index, attachmentIndex, e)
                          }
                          accept="application/pdf"
                          className="block w-full cursor-pointer text-sm file:mr-2 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none dark:text-white dark:file:bg-gray-700 dark:file:text-white"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveAttachment(index, attachmentIndex)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <Button
            type="submit"
            className="mt-6 w-min dark:bg-white dark:text-black dark:hover:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditChapter;
