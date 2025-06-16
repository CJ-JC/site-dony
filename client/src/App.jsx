import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import Admin from "@/pages/admin/Admin";
import NotFound from "@/pages/404";
import Home from "@/pages/Home";
import Account from "@/pages/user/Account";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import MasterClass from "@/components/Masterclass";
import MasterclassDetail from "@/components/MasterclassDetail";
import CreateMasterclass from "@/pages/admin/masterclass/CreateMasterclass";
import EditMasterclass from "@/pages/admin/masterclass/EditMasterclass";
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
import Replay from "./pages/admin/replay/Replay";
import CreateReplay from "./pages/admin/replay/CreateReplay";
import EditReplay from "./pages/admin/replay/EditReplay";
import ShowMasterclass from "@/pages/admin/masterclass/ShowMasterclass";

const Layout = ({ toggleTheme, theme }) => (
  <>
    <Navbar toggleTheme={toggleTheme} theme={theme} />
    <Outlet />
    <Footer toggleTheme={toggleTheme} theme={theme} />
  </>
);

function App() {
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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="mx-auto h-auto md:h-screen">
      <ScrollToTop />
      <Routes>
        {/* <Route path="/" element={<Maintenance />} /> */}
        <Route
          path="/"
          element={<Layout toggleTheme={toggleTheme} theme={theme} />}
        >
          <Route path="/" element={<Home />} />

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
          <Route path="masterclass" element={<ShowMasterclass />} />
          <Route path="create-masterclass" element={<CreateMasterclass />} />
          <Route path="edit-masterclass/:id" element={<EditMasterclass />} />

          <Route path="masterclass/:slug/replay" element={<Replay />} />
          <Route
            path="masterclass/:slug/replay/create"
            element={<CreateReplay />}
          />
          <Route
            path="/administrator/masterclass/:slug/replay/:id"
            element={<EditReplay />}
          />

          <Route path="instructors" element={<Instructors />} />
          <Route path="instructor/create" element={<CreateInstructor />} />
          <Route path="instructor/edit/:id" element={<EditInstructor />} />

          <Route path="users" element={<Users />} />

          <Route path="profile" element={<AccountAdmin />} />
          <Route path="profile/user/:id" element={<UserProfile />} />
        </Route>

        <Route path="/download/invoices/:fileName" element={<Download />} />

        <Route path="*" element={<NotFound />} />

        <Route path="politique" element={<Politique />} />
        <Route path="cgu" element={<Cgu />} />
        <Route path="cgv" element={<Cgv />} />
      </Routes>
    </div>
  );
}

export default App;
