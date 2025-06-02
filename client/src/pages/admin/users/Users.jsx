import { Button } from "@material-tailwind/react";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchInput from "@/components/search/SearchInput";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import Loading from "@/widgets/utils/Loading";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const UsersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [purchases, setPurchases] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user`);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des utilisateurs");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment/get-purchases`,
        );
        setPurchases(response.data);
        const completedPurchases = response.data.filter(
          (purchase) => purchase.status === "completed",
        );

        const total = completedPurchases.reduce(
          (acc, purchase) => acc + purchase.amount,
          0,
        );

        setTotalBenefits(total);
      } catch (error) {
        setError("Erreur lors de la récupération des achats :", error);
      }
    };

    fetchPurchases();
  }, []);

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter((user) => {
    const firstname = user.firstName || "";
    return firstname.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Utilisateurs paginés
  const indexOfLastUser = currentPage * UsersPerPage;
  const indexOfFirstUser = indexOfLastUser - UsersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Gérer la saisie dans la barre de recherche
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Tableau des utilisateurs */}
      <div className="relative flex w-full flex-col overflow-scroll rounded-lg border bg-white bg-clip-border p-4 text-gray-700 shadow-md dark:bg-[#25303F]">
        <Typography
          variant="h3"
          className="mb-3 text-xl font-bold dark:text-white md:text-3xl"
          color="blue-gray"
        >
          Liste des utilisateurs
        </Typography>
        <div className="flex-column mb-4 flex flex-wrap items-center justify-center space-y-4 sm:flex-row sm:space-y-4 md:justify-between">
          <SearchInput handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-[#F9FAFB] font-medium text-gray-700 dark:bg-blue-gray-700 dark:text-white">
            <tr>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Nom
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Prénom
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Email
                </p>
              </th>
              <th className="border-slate-200 bg-slate-50 border-b p-4">
                <p className="text-slate-500 text-sm font-normal leading-none">
                  Rôle
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
            {currentUsers.map((user, index) => (
              <tr
                className="hover:bg-slate-50 border-slate-200 border-b dark:text-white"
                key={index}
              >
                <td className="p-4 py-4">
                  <p className="text-slate-800 block text-sm font-semibold">
                    {user.firstName}
                  </p>
                </td>
                <td className="p-4 py-4">
                  <p className="text-slate-800 block text-sm font-semibold">
                    {user.lastName}
                  </p>
                </td>
                <td className="p-4 py-4">
                  <p className="text-slate-800 block text-sm">{user.email}</p>
                </td>
                <td className="p-4 py-4">
                  <p className="text-slate-800 text-sm">
                    {user.role && user.role === "admin" ? "Admin" : "Client"}
                  </p>
                </td>
                <td className="flex items-center space-x-2 p-1 py-4">
                  <Link to={`/administrator/profile/user/${user.id}`}>
                    <Button
                      size="sm"
                      className="flex items-center bg-gray-700 text-white focus:outline-none"
                      title="Voir les informations de l'utilisateur"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* <Link to={`/administrator/user/delete/${user.id}`}>
                    <Button
                      size="sm"
                      className="flex items-center bg-red-600 text-white focus:outline-none"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Link> */}
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
              {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)}
            </b>{" "}
            sur <b>{filteredUsers.length}</b>
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
              ...Array(Math.ceil(filteredUsers.length / UsersPerPage)).keys(),
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
                currentPage === Math.ceil(filteredUsers.length / UsersPerPage)
              }
              onClick={() => paginate(currentPage + 1)}
              className={`ease min-h-9 min-w-9 rounded border px-3 py-1 text-sm font-normal transition duration-200 ${
                currentPage === Math.ceil(filteredUsers.length / UsersPerPage)
                  ? "border-gray-200 bg-gray-100 text-gray-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
