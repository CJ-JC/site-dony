import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PublishReplay = ({ replayId, isPublished, onStatusChange }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const handlePublish = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/replay/${replayId}/publish`,
        {
          isPublished: !isPublished,
        },
      );
      onStatusChange(response.data.isPublished);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <>
      <div>
        <button
          onClick={handlePublish}
          className={`ring-offset-background focus-visible:ring-ring border-input bg-background ${
            isPublished
              ? "bg-white text-black hover:bg-gray-200 hover:text-gray-900"
              : "bg-white text-black hover:bg-gray-200 hover:text-gray-900"
          } inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
        >
          {isPublished ? "Annuler la publication" : "Publier cette rediffusion"}
        </button>
      </div>
    </>
  );
};

export default PublishReplay;
