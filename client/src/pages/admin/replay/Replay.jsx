import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ReactQuill from "react-quill";

const Replay = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { slug } = useParams();

  const MasterclassVideo = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const [replays, setReplays] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState(null);

  useEffect(() => {
    const fetchReplays = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/replay/masterclass/${slug}`,
        );
        setReplays(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des replays :", error);
      }
    };

    fetchReplays();
  }, [slug]);

  const openDeleteDialog = (inputs) => {
    setSelectedReplay(inputs);
    setDeleteDialog(true);
  };

  const handleDeleteReplay = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/replay/delete/${selectedReplay}`);
      setDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur suppression replay :", error);
    }
  };

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-scroll rounded-lg border bg-white bg-clip-border p-4 text-gray-700 shadow-md dark:bg-[#25303F]">
        <div className="flex-column mb-4 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-4 md:justify-between">
          <Typography
            variant="h3"
            className="text-xl font-bold dark:text-white md:text-3xl"
            color="blue-gray"
          >
            Liste des replays
          </Typography>
          <Link to={`/administrator/masterclass/${slug}/replay/create`}>
            <Button
              variant="gradient"
              size="sm"
              className="flex items-center text-white focus:outline-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle rediffusion
            </Button>
          </Link>
        </div>

        {replays.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {replays.map((replay) => (
              <div
                key={replay.id}
                className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {/* Aperçu vidéo ou image */}
                <div className="relative aspect-video bg-gray-100">
                  {replay.videoUrl ? (
                    <video
                      src={MasterclassVideo + replay.videoUrl}
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Vidéo non disponible
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{replay.title}</h3>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-gray-500">
                      📅{" "}
                      {new Date(replay.recordedAt).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="max-h-[100px] overflow-y-auto">
                    <ReactQuill
                      value={replay.description}
                      readOnly={true}
                      theme="bubble"
                      className="text-gray-700"
                    />
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      {replay.isPublished ? (
                        <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          Publié
                        </span>
                      ) : (
                        <span className="me-2 rounded bg-red-400 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-red-700 dark:text-red-300">
                          Non publié
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/administrator/masterclass/${slug}/replay/${replay.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        ✏️ Modifier
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(replay.id)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aucun replay disponible pour cette masterclass.
          </p>
        )}
      </div>
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
        <DialogHeader>Confirmer la suppression</DialogHeader>
        <DialogBody>
          Êtes-vous sûr de vouloir supprimer le replay ? Cette action est
          irréversible.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setDeleteDialog(false)}
            className="mr-1"
          >
            Annuler
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteReplay}>
            Confirmer
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Replay;
