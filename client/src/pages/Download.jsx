import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Download = () => {
  const { fileName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(async () => {
    window.location.href = `${BASE_URL}/api/download/${fileName}`;
  }, [fileName]);

  return <p>Redirection en cours...</p>;
};

export default Download;
