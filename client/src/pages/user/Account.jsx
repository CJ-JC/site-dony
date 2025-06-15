import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Dashboard from "./Dashboard";
import Invoice from "./Invoice";
import Settings from "./Settings";
import { ReceiptTextIcon, VideoIcon } from "lucide-react";
import Profile from "./Profile";
import axios from "axios";
import Replay from "./Replay";

const Account = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [authLoading, setAuthLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [replayData, setReplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [masterclassOptions, setMasterclassOptions] = useState([]);
  const [masterclasses, setMasterclasses] = useState([]);

  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_URL;
  const [profileMessage, setProfileMessage] = useState({
    type: "",
    content: "",
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    content: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordCurrent: "",
    password: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/user/profile/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
      } catch (error) {
        setMessage({
          type: "error",
          content:
            error.response?.data?.message ||
            "Erreur lors de la récupération des données",
        });
      }
    };

    if (isLoggedIn && !authLoading) {
      fetchUserData();
    }
  }, [isLoggedIn, authLoading, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/user/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileMessage({
        type: "success",
        content: "Profil mis à jour avec succès.",
      });
      setIsEditing(false);
    } catch (error) {
      setProfileMessage({
        type: "error",
        content:
          error.response?.data?.message || "Erreur lors de la mise à jour.",
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        content: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/user/${user.id}/password`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPasswordMessage({
        type: "success",
        content: "Mot de passe mis à jour avec succès.",
      });
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        passwordCurrent: "",
      }));
    } catch (error) {
      setPasswordMessage({
        type: "error",
        content:
          error.response?.data?.message || "Erreur lors de la mise à jour.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (!token) return navigate("/sign-in");

      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment/my-purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setPurchases(response.data.purchases);
      } catch (error) {
        console.error("Erreur lors de la récupération des achats :", error);
      }
    };

    fetchUserPurchases();
  }, []);

  useEffect(() => {
    if (
      !authLoading &&
      (!isLoggedIn || !user || (user.role !== "admin" && user.role !== "user"))
    ) {
      return navigate("/sign-in");
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchReplays = async () => {
      if (!token) return navigate("/sign-in");

      try {
        const response = await axios.get(
          `${BASE_URL}/api/replay/user/my-replays`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // setReplayData(response.data.replays);
        const replayList = response.data.replays || [];

        // ✅ Filtrer uniquement les replays publiés
        const publishedReplays = replayList.filter(
          (replay) => replay.isPublished,
        );
        setReplayData(publishedReplays);

        // ✅ Extraire masterclasses uniques
        const uniqueMasterclasses = Array.from(
          new Map(
            publishedReplays.map((r) => [r.masterclass.id, r.masterclass]),
          ).values(),
        );

        // Créer les options pour react-select
        const options = uniqueMasterclasses.map((mc) => ({
          value: mc.id,
          label: mc.title,
        }));

        setMasterclassOptions(options);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReplays();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/masterclass/my-courses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMasterclasses(res.data.masterclasses);
      } catch (err) {
        console.error("Erreur chargement masterclasses :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const data = [
    {
      label: "Tableau de bord",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      component: <Dashboard loading={loading} masterclasses={masterclasses} />,
    },
    {
      label: "Revoir mes cours",
      value: "replay",
      icon: VideoIcon,
      component: (
        <Replay
          replayData={replayData}
          loading={loading}
          masterclassOptions={masterclassOptions}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          setMasterclassOptions={setMasterclassOptions}
        />
      ),
    },
    {
      label: "Historique d'achat",
      value: "invoice",
      icon: ReceiptTextIcon,
      component: <Invoice purchases={purchases} formData={formData} />,
    },
    {
      label: "Profil",
      value: "profil",
      icon: UserCircleIcon,
      component: (
        <Profile
          formData={formData}
          handleChange={handleChange}
          setIsEditing={setIsEditing}
          profileMessage={profileMessage}
          isEditing={isEditing}
          handleProfileSubmit={handleProfileSubmit}
        />
      ),
    },
    {
      label: "Paramètres",
      value: "settings",
      icon: Cog6ToothIcon,
      component: (
        <Settings
          formData={formData}
          handleChange={handleChange}
          setIsEditing={setIsEditing}
          passwordMessage={passwordMessage}
          isEditing={isEditing}
          handlePasswordSubmit={handlePasswordSubmit}
          togglePasswordVisibility={togglePasswordVisibility}
          showPassword={showPassword}
          setFormData={setFormData}
        />
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-5">
      <div className="container mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mon compte
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">
            Gérez vos informations, formations et achats.
          </p>
        </div>
        <Tabs value={activeTab}>
          <TabsHeader className="overflow-auto pb-2">
            {data.map(({ label, value, icon }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => handleTabChange(value)}
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, component }) => (
              <TabPanel key={value} value={value} className="px-0">
                {component}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </section>
  );
};

export default Account;
