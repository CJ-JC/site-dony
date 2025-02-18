import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { PencilIcon, PlusCircle, Trash, User2 } from "lucide-react";

export default function Instructors() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/instructor`);
      setInstructors(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des instructeurs");
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleEdit = (instructor) => {
    navigate(`/administrator/instructor/edit/${instructor.id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/instructor/delete/${selectedInstructor.id}`,
      );
      setDeleteDialog(false);
      fetchInstructors();
    } catch (err) {
      setError("Erreur lors de la suppression de l'instructeur");
    }
  };

  const openDeleteDialog = (instructor) => {
    setSelectedInstructor(instructor);
    setDeleteDialog(true);
  };

  return (
    <div className="relative flex w-full flex-col overflow-scroll rounded-lg border bg-white bg-clip-border p-4 text-gray-700 shadow-md dark:bg-[#25303F]">
      <div className="mb-4 flex items-center justify-between">
        <Typography
          variant="h3"
          className="text-xl font-bold dark:text-white md:text-3xl"
          color="blue-gray"
        >
          Liste des Instructeurs
        </Typography>
        <Link to={"/administrator/instructor/create"}>
          <Button
            variant="gradient"
            size="sm"
            className="flex items-center text-white focus:outline-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer un Instructeur
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      <table className="w-full min-w-max table-auto text-left">
        <thead className="bg-[#F9FAFB] font-medium text-gray-700 dark:bg-blue-gray-700 dark:text-white">
          <tr>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Photo
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Nom complet
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Biographie
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Action
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr
              className="hover:bg-slate-50 border-slate-200 border-b dark:text-white"
              key={instructor.id}
            >
              <td className="p-4">
                {instructor?.imageUrl ? (
                  <img
                    src={`${CoursesImage}${instructor?.imageUrl}`}
                    alt={instructor?.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <User2 className="h-14 w-14 rounded-full bg-gray-400 p-2" />
                )}
              </td>
              <td className="p-4 py-5">
                <p className="text-slate-800 block text-sm font-semibold">
                  {instructor.name}
                </p>
              </td>
              <td className="p-4 py-5">
                <p className="text-slate-500 text-sm">
                  {instructor.biography.length > 120
                    ? instructor.biography.substring(
                        0,
                        instructor.biography.lastIndexOf(" ", 120),
                      ) + "..."
                    : instructor.biography}
                </p>
              </td>
              <td className="flex items-center gap-2 p-4 py-5">
                <Button
                  onClick={() => handleEdit(instructor)}
                  size="sm"
                  title="Modifier"
                  className="flex items-center bg-blue-gray-100 focus:outline-none"
                >
                  <PencilIcon className="h-4 w-4 text-black" />
                </Button>
                <Button
                  onClick={() => openDeleteDialog(instructor)}
                  size="sm"
                  title="Supprimer"
                  className="flex items-center bg-red-600 text-white focus:outline-none"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
        <DialogHeader>Confirmer la suppression</DialogHeader>
        <DialogBody>
          Êtes-vous sûr de vouloir supprimer l'instructeur{" "}
          {selectedInstructor?.name} ? Cette action est irréversible.
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
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Confirmer
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
