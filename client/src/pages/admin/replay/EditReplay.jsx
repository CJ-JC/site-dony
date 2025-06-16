import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import Editor from "@/widgets/utils/Editor";
import PublishReplay from "@/widgets/utils/PublishReplay";

const EditReplay = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [masterclass, setMasterclass] = useState(null);
  const [file, setFile] = useState(null);
  const [courseDates, setCourseDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const MasterclassVideo = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const [form, setForm] = useState({
    title: "",
    description: "",
    recordedAt: new Date(),
    masterclassId: "",
    isPublished: false,
  });

  const generateCourseDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      dates.push(date);
    }
    return dates;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [masterclassRes, replayRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/masterclass/slug/${slug}`),
          axios.get(`${BASE_URL}/api/replay/${id}`),
        ]);

        const mc = masterclassRes.data;
        const replay = replayRes.data;

        setMasterclass(mc);
        setVideoUrl(MasterclassVideo + replay.videoUrl);

        setForm({
          title: replay.title || "",
          description: replay.description || "",
          recordedAt: new Date(replay.recordedAt),
          masterclassId: mc.id,
          isPublished: replay.isPublished,
        });

        setCourseDates(generateCourseDates(new Date(mc.startDate)));
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, [slug, id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("recordedAt", form.recordedAt.toISOString());
      formData.append("masterclassId", form.masterclassId);
      formData.append("isPublished", form.isPublished);

      if (file) {
        formData.append("file", file);
      }

      await axios.put(`${BASE_URL}/api/replay/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      navigate(`/administrator/masterclass/${slug}/replay`);
    } catch (err) {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setForm((prev) => ({ ...prev, isPublished: newStatus }));
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      {form.isPublished === false && (
        <div className="border-yellow-30 text-primary mb-4 flex w-full items-center border bg-yellow-200/80 p-4 text-sm dark:bg-white/90 dark:text-black">
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
            className="lucide lucide-triangle-alert mr-2 h-4 w-4"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
          Cette rediffusion n'est pas publiée. Elle ne sera pas visible pour les
          élèves.
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Modifier le Replay</h2>
        <PublishReplay
          replayId={id}
          isPublished={form.isPublished}
          onStatusChange={handleStatusChange}
        />
      </div>

      {masterclass && (
        <div className="mb-6 rounded bg-gray-100 p-4">
          <h3 className="text-lg font-semibold text-[#40CBB4]">
            {masterclass.title}
          </h3>
          <p className="text-sm text-gray-600">
            📅{" "}
            {new Date(masterclass.startDate).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dates prédéfinies */}
        <div>
          <label className="block text-sm font-medium">Semaine du cours</label>
          <select
            name="recordedAt"
            value={form.recordedAt.toISOString()}
            onChange={(e) =>
              setForm({ ...form, recordedAt: new Date(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Sélectionnez une date</option>
            {courseDates.map((date, index) => (
              <option key={index} value={date.toISOString()}>
                {`Cours n°${index + 1} — ${date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`}
              </option>
            ))}
          </select>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium">Titre du Replay</label>
          <Input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Editor
            name="description"
            value={form.description}
            onChange={handleChange}
            className="dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium">
              Date d'enregistrement
            </label>
            <DatePicker
              selected={form.recordedAt}
              onChange={(date) => setForm({ ...form, recordedAt: date })}
              dateFormat="dd MMMM yyyy"
              locale="fr"
              className="mt-1 w-full rounded-md border px-2 py-2"
              required
            />
          </div>

          {/* Upload fichier */}
          <div>
            <label className="flex w-52 cursor-pointer flex-col items-center justify-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm hover:text-gray-700 dark:text-black">
              <svg
                className="h-8 w-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="text-center text-sm leading-normal">
                Changer la vidéo
              </span>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
            </label>
            {videoUrl && (
              <div className="mb-4">
                <video
                  src={videoUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="mt-2 h-56 w-full rounded object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to={`/administrator/masterclass/${slug}/replay`}>
            <Button variant="outlined" className="p-2">
              <ArrowBack className="mr-2" /> Retour
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le Replay"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditReplay;
