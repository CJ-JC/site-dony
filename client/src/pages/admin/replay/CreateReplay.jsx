import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import Editor from "@/widgets/utils/Editor";

const CreateReplay = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { slug } = useParams();

  const [masterclass, setMasterclass] = useState(null);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(null);
  const [courseDates, setCourseDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    masterclassId: "",
    file: null,
    recordedAt: new Date(),
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
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/masterclass/slug/${slug}`,
        );
        setMasterclass(response.data);

        setForm((prev) => ({
          ...prev,
          masterclassId: response.data.id,
        }));

        // Génère les 12 dates à partir de la date de début
        const generatedDates = generateCourseDates(
          new Date(response.data.startDate),
        );
        setCourseDates(generatedDates);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };

    fetchMasterclass();
  }, [slug]);

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
      formData.append("masterclassId", form.masterclassId);
      formData.append("recordedAt", form.recordedAt.toISOString());

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `${BASE_URL}/api/replay/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSuccess(true);
      setForm({
        title: "",
        description: "",
        recordedAt: new Date(),
        masterclassId: slug,
      });
      setFile(null);
      const replayId = response.data;
      navigate(`/administrator/masterclass/${slug}/replay/${replayId.id}`);
    } catch (err) {
      console.error(err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Uploader un Replay</h2>

        <Link to={`/administrator/masterclass/${slug}/replay`}>
          <Button variant="outlined" className="p-2">
            <ArrowBack className="mr-2" /> Retour
          </Button>
        </Link>
      </div>
      {masterclass && (
        <div className="mb-6 rounded bg-gray-100 p-4">
          <h3 className="text-lg font-semibold text-[#40CBB4]">
            {masterclass.title}
          </h3>
          <p className="text-sm text-gray-600">
            📅{" "}
            {new Date(masterclass.startDate).toLocaleString("fr-FR", {
              dateStyle: "long",
            })}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Semaine du cours</label>
        <select
          name="recordedAt"
          value={form.recordedAt}
          onChange={(e) =>
            setForm({ ...form, recordedAt: new Date(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border p-2"
          required
        >
          <option value="">Sélectionnez une date</option>
          {courseDates.map((date, index) => (
            <option key={index} value={date.toISOString()}>
              {`Cours #${index + 1} — ${date.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="mt-4 block text-sm font-medium" htmlFor="title">
            Titre du Replay
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Cours #1 - Introduction"
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <Editor
            name="description"
            value={form.description}
            onChange={handleChange}
            className="dark:text-white"
          />
        </div>

        <div className="flex justify-between">
          <div>
            <label className="block text-sm font-medium">
              Date d'enregistrement
            </label>
            <DatePicker
              selected={form.recordedAt}
              onChange={(date) => setForm({ ...form, recordedAt: date })}
              dateFormat="dd MMMM yyyy"
              locale={"fr"}
              className="mt-1 w-full rounded-md border px-2 py-2"
              required
            />
          </div>

          {/* Fichier vidéo */}
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
                Vidéo du replay
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

        {/* Submit */}
        <div className="mx-auto flex justify-center">
          <div>
            <Button type="submit">Uploader le Replay</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReplay;
