import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Download = () => {
  const { fileName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(async () => {
    window.location.href = `${BASE_URL}/api/download/${fileName}`;
  }, [fileName]);

  return (
    <>
      <div className="mx-auto flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl">Redirection en cours...</h1>
      </div>
    </>
  );
};

export default Download;
