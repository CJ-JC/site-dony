import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import CoursePlayer from "@/dashboard/CoursePlayer";
import Courses from "@/pages/Courses";
import Admin from "@/pages/admin/Admin";
import CreateCourse from "@/pages/admin/course/CreateCourse";
import NotFound from "@/pages/404";
import EditCourse from "@/pages/admin/course/EditCourse";
import CreateChapter from "@/pages/admin/course/CreateChapter";
import EditChapter from "@/pages/admin/course/EditChapter";
import Home from "@/pages/Home";
import Account from "@/pages/user/Account";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import Remise from "@/pages/admin/Remise";
import ShowCourses from "@/pages/admin/course/ShowCourses";
import axios from "axios";
import Loading from "@/widgets/utils/Loading";
import Masterclass from "@/pages/admin/masterclass/ShowMasterclass";
import MasterClass from "@/components/Masterclass";
import MasterclassDetail from "@/components/MasterclassDetail";
import CreateMasterclass from "@/pages/admin/masterclass/CreateMasterclass";
import EditMasterclass from "@/pages/admin/masterclass/EditMasterclass";
import CourseDetail from "@/components/CourseDetail";
import CreateInstructor from "@/pages/admin/instructor/CreateInstructor";
import Instructors from "@/pages/admin/instructor/Instructors";
import EditInstructor from "@/pages/admin/instructor/EditInstructor";
import Users from "@/pages/admin/users/Users";
import AccountAdmin from "@/pages/admin/users/AccountAdmin";
import Setting from "@/pages/user/Settings";
import Success from "@/pages/Success";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Politique from "@/pages/Politique";
import Cgu from "@/pages/Cgu";
import Cgv from "@/pages/Cgv";
import Maintenance from "./pages/Maintenance";
import Download from "@/pages/Download";
import UserProfile from "./pages/admin/users/UserProfile";
import Services from "./components/Services";
import ScrollToTop from "@/widgets/utils/ScrollToTop";

const Layout = ({
  globalDiscount,
  discountPercentage,
  isExpired,
  toggleTheme,
  theme,
  timeLeft,
}) => (
  <>
    {!isExpired && globalDiscount && (
      <div className="text-md flex w-full items-center justify-center bg-orange-700/60 p-4">
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
          className="lucide lucide-triangle-alert mr-1 h-4 w-4"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
        Bénéficiez de {discountPercentage}% de réductions sur les cours de votre
        choix.{" "}
        <span className="ml-1 font-bold">
          ⏳ Offre expire dans : {timeLeft}
        </span>
      </div>
    )}
    <Navbar toggleTheme={toggleTheme} theme={theme} />
    <Outlet />
    <Footer toggleTheme={toggleTheme} theme={theme} />
  </>
);

function App() {
  const [globalDiscount, setGlobalDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Fonction pour calculer le temps restant
  const calculateTimeLeft = (expiryDate) => {
    const now = new Date();
    const difference = expiryDate - now;

    if (difference <= 0) {
      setIsExpired(true);
      return "Expiré";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return days > 0
      ? `${days}j ${hours}h ${minutes}m ${seconds}s`
      : `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/remise`);
        const remises = response.data;

        if (!remises || remises.length === 0) {
          setGlobalDiscount(false);
          setDiscountPercentage(0);
          setIsExpired(false);
          setAuthLoading(false);
          return;
        }

        const globalRemise = remises.find((remise) => remise.isGlobal);

        if (globalRemise) {
          const expirationDate = new Date(globalRemise.expirationDate);
          const now = new Date();

          if (expirationDate > now) {
            setGlobalDiscount(true);
            setDiscountPercentage(globalRemise.discountPercentage);
            setIsExpired(false);
            setExpirationDate(expirationDate);
            setTimeLeft(calculateTimeLeft(expirationDate));
          } else {
            setGlobalDiscount(false);
            setDiscountPercentage(0);
            setIsExpired(true);
          }
        } else {
          setGlobalDiscount(false);
          setDiscountPercentage(0);
          setIsExpired(false);
        }

        setAuthLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération des remises :", error);
        setAuthLoading(false);
      }
    };

    fetchRemises();
  }, []);

  // Mise à jour du countdown toutes les secondes
  useEffect(() => {
    if (!expirationDate || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expirationDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate, isExpired]);

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto h-auto md:h-screen">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Maintenance />} />
        <Route
          path="/"
          element={
            <Layout
              globalDiscount={globalDiscount}
              discountPercentage={discountPercentage}
              isExpired={isExpired}
              toggleTheme={toggleTheme}
              theme={theme}
              timeLeft={timeLeft}
            />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="detail/slug/:id" element={<CourseDetail />} />
          <Route path="masterclass" element={<MasterClass />} />
          <Route path="services" element={<Services />} />
          <Route
            path="masterclass/slug/:slug"
            element={<MasterclassDetail />}
          />

          <Route path="user/account" element={<Account />} />
          <Route path="user/account/settings" element={<Setting />} />

          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="success" element={<Success />} />
        </Route>

        <Route
          path="/administrator"
          element={<Admin toggleTheme={toggleTheme} theme={theme} />}
        >
          <Route path="create-chapter/:courseId" element={<CreateChapter />} />
          <Route
            path="course/:courseId/edit-chapter/:id"
            element={<EditChapter />}
          />

          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="courses" element={<ShowCourses />} />

          <Route path="masterclass" element={<Masterclass />} />
          <Route path="create-masterclass" element={<CreateMasterclass />} />
          <Route path="edit-masterclass/:id" element={<EditMasterclass />} />

          <Route path="instructors" element={<Instructors />} />
          <Route path="instructor/create" element={<CreateInstructor />} />
          <Route path="instructor/edit/:id" element={<EditInstructor />} />

          <Route path="users" element={<Users />} />

          <Route path="profile" element={<AccountAdmin />} />
          <Route path="profile/user/:id" element={<UserProfile />} />

          <Route path="remise" element={<Remise />} />
        </Route>

        <Route path="/download/invoices/:fileName" element={<Download />} />

        <Route
          path="/course-player/course/:courseId/chapters/:chapterId"
          element={<CoursePlayer toggleTheme={toggleTheme} theme={theme} />}
        />

        <Route path="*" element={<NotFound />} />

        <Route path="politique" element={<Politique />} />
        <Route path="cgu" element={<Cgu />} />
        <Route path="cgv" element={<Cgv />} />
      </Routes>
    </div>
  );
}

export default App;
