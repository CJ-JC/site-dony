import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Edit, PlusCircle, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "@/components/search/SearchInput";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css"; // Importez le CSS de react-datepicker
import { fr } from "date-fns/locale";
import { format } from "date-fns";

// Fonction de formatage de la date
const formatDateTime = (isoDate) => {
  try {
    return format(new Date(isoDate), "dd MMMM yyyy, HH:mm", { locale: fr });
  } catch {
    return "Date invalide";
  }
};

const ShowMasterclass = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const masterclassesPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [masterclasses, setMasterclasses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedMasterclass, setMasterclass] = useState(null);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/masterclass`);
        setMasterclasses(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des masterclasses :",
          error,
        );
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/masterclass/delete/${selectedMasterclass.id}`,
      );
      setDeleteDialog(false);
      window.location.reload();
    } catch (err) {
      setError("Erreur lors de la suppression de l'instructeur");
    }
  };

  const openDeleteDialog = (masterclass) => {
    setMasterclass(masterclass);
    setDeleteDialog(true);
  };

  // Filtrer les cours en fonction de la recherche et des dates
  const filteredMasterclasses = masterclasses.filter((masterclass) => {
    // Filtre par titre
    const titleMatch = masterclass.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return titleMatch;
  });

  // Calcul des masterclasses à afficher pour la page actuelle
  const indexOfLastMasterclass = currentPage * masterclassesPerPage;
  const indexOfFirstMasterclass = indexOfLastMasterclass - masterclassesPerPage;
  const currentMasterclasses = filteredMasterclasses.slice(
    indexOfFirstMasterclass,
    indexOfLastMasterclass,
  );

  // Fonction de pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction de gestion de la recherche
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Table des Masterclasses */}
      <div className="relative flex h-full w-full flex-col overflow-scroll rounded-lg border bg-white bg-clip-border p-4 text-gray-700 shadow-md dark:bg-[#25303F]">
        <Typography
          variant="h3"
          className="mb-3 text-xl font-bold dark:text-white md:text-3xl"
          color="blue-gray"
        >
          Liste des masterclasses
        </Typography>

        <div className="flex-column mb-4 flex flex-wrap items-center justify-center space-y-4 sm:flex-row sm:space-y-4 md:justify-between">
          <SearchInput handleSearch={handleSearch} searchQuery={searchQuery} />
          <Link to={"/administrator/create-masterclass"}>
            <Button
              variant="gradient"
              size="sm"
              className="flex items-center text-white focus:outline-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau masterclass
            </Button>
          </Link>
        </div>
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-[#F9FAFB] font-medium text-gray-700 dark:bg-blue-gray-700 dark:text-white">
            <tr>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Titre
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Prix
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Début
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Fin
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
            {currentMasterclasses.map((masterclass, index) => (
              <tr
                className="hover:bg-slate-50 border-slate-200 border-b dark:text-white"
                key={index}
              >
                <td className="p-4 py-5">
                  <p className="text-slate-800 block text-sm">
                    {masterclass.title}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-500 text-sm">{masterclass.price}€</p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-500 text-sm">
                    {formatDateTime(masterclass.startDate)}
                  </p>
                </td>
                <td className="p-4 py-5">
                  <p className="text-slate-500 text-sm">
                    {formatDateTime(masterclass.endDate)}
                  </p>
                </td>
                <td className="flex items-center gap-2 p-4 py-5">
                  <Link
                    to={`/administrator/edit-masterclass/${masterclass.id}`}
                    className="flex w-min items-center gap-1 rounded-lg bg-gray-700 p-2 text-sm font-medium text-white hover:bg-gray-200 dark:text-black"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => openDeleteDialog(masterclass)}
                    className="flex items-center gap-1 rounded-lg p-2 dark:text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-slate-500 text-sm dark:text-white">
            Afficher{" "}
            <b>
              {indexOfFirstMasterclass + 1}-
              {Math.min(indexOfLastMasterclass, filteredMasterclasses.length)}
            </b>{" "}
            sur <b>{filteredMasterclasses.length}</b>
          </div>
          <div className="flex space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                currentPage === 1
                  ? "border-gray-200 bg-gray-100 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Précédent
            </button>
            {[
              ...Array(
                Math.ceil(filteredMasterclasses.length / masterclassesPerPage),
              ).keys(),
            ].map((page) => (
              <button
                key={page + 1}
                onClick={() => paginate(page + 1)}
                className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                  currentPage === page + 1
                    ? "border-gray-800 bg-gray-800 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={
                currentPage ===
                Math.ceil(filteredMasterclasses.length / masterclassesPerPage)
              }
              onClick={() => paginate(currentPage + 1)}
              className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                currentPage ===
                Math.ceil(filteredMasterclasses.length / masterclassesPerPage)
                  ? "border-gray-200 bg-gray-100 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
        <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
          <DialogHeader>Confirmer la suppression</DialogHeader>
          <DialogBody>
            Êtes-vous sûr de vouloir supprimer la masterclasse{" "}
            {selectedMasterclass?.name} ? Cette action est irréversible.
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
    </>
  );
};

export default ShowMasterclass;
