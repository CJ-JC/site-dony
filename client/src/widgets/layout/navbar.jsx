import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logoDay from "/img/logo-day.svg";
import logoNight from "/img/logo-night.svg";
import axios from "axios";
import { checkAuthStatus } from "../utils/CheckAuthStatus";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "@/reducer/auth";
import Loading from "../utils/Loading";
import { MoonIcon, SunIcon } from "lucide-react";

export function Navbar({ toggleTheme, theme }) {
  const [openNav, setOpenNav] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const activeOnglet = localStorage.getItem("activeOnglet");

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const handleLinkClick = () => {
    setOpenNav(false);
  };

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(loggedOut());
    window.location.reload();
  };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2">
      <NavLink
        to="/"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-semibold text-gray-800 dark:border-white dark:bg-white dark:text-black"
              : "bg-white font-semibold text-gray-600 hover:bg-gray-100 dark:border-b dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          }`
        }
      >
        Accueil
      </NavLink>

      <NavLink
        to="/courses"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-semibold text-gray-800 dark:border-white dark:bg-white dark:text-black"
              : "bg-white font-semibold text-gray-600 hover:bg-gray-100 dark:border-b dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          }`
        }
      >
        Nos formations
      </NavLink>
      <NavLink
        to="/masterclass"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-semibold text-gray-800 dark:border-white dark:bg-white dark:text-black"
              : "bg-white font-semibold text-gray-600 hover:bg-gray-100 dark:border-b dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          }`
        }
      >
        Masterclass
      </NavLink>
      <NavLink
        to="/services"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-semibold text-gray-800 dark:border-white dark:bg-white dark:text-black"
              : "bg-white font-semibold text-gray-600 hover:bg-gray-100 dark:border-b dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          }`
        }
      >
        Prestations
      </NavLink>
    </ul>
  );

  return (
    <MTNavbar
      color="transparent"
      className="mx-auto max-w-screen-xl rounded-none border-b p-3"
    >
      <div className="container mx-auto flex items-center justify-between text-black">
        <Link to="/" onClick={handleLinkClick}>
          {theme === "dark" ? (
            <img src={logoNight} width={200} alt="logo donymusic" />
          ) : (
            <img src={logoDay} width={200} alt="logo donymusic" />
          )}
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex">
          {isLoggedIn && user ? (
            <>
              <Link
                to={user.role === "admin" ? `${activeOnglet}` : "/user/account"}
              >
                <Button
                  variant="outlined"
                  onClick={handleLinkClick}
                  className="font-medium text-gray-800 dark:bg-white dark:text-black"
                  size="sm"
                >
                  Mon compte
                </Button>
              </Link>
              <Link to={"#"}>
                <Button
                  variant="gradient"
                  color="red"
                  className="border border-red-500 font-medium dark:bg-black dark:text-white"
                  size="sm"
                  onClick={logout}
                >
                  Déconnexion
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handleLinkClick}
                  className="font-medium text-gray-800 dark:bg-white dark:text-black"
                >
                  Connexion
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  // variant="gradient"
                  size="sm"
                  fullWidth
                  onClick={handleLinkClick}
                  className="border border-black font-medium dark:text-white"
                >
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="theme-toggle rounded-md hover:bg-gray-300"
          >
            {theme === "dark" ? (
              <SunIcon className="h-8 w-8 p-1 text-white dark:hover:text-black" />
            ) : (
              <MoonIcon className="h-8 w-8 p-1" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="theme-toggle rounded-md hover:bg-gray-200"
          >
            {theme === "dark" ? (
              <SunIcon className="h-8 w-8 p-1 text-white" />
            ) : (
              <MoonIcon className="h-8 w-8 p-1" />
            )}
          </button>
          <IconButton
            variant="text"
            size="sm"
            color="white"
            className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent dark:bg-white lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
              <Bars3Icon strokeWidth={2} className="h-6 w-6" />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse
        className="absolute left-2/4 z-50 w-[350px] -translate-x-2/4 rounded-xl text-gray-900"
        open={openNav}
      >
        <div className="container mx-auto border bg-white px-4 pb-4 pt-2 dark:bg-[#020818]">
          {navList}
          {isLoggedIn && user ? (
            <div className="flex items-center justify-center space-x-2">
              <Link
                to={user.role === "admin" ? `${activeOnglet}` : "/user/account"}
              >
                <Button onClick={handleLinkClick} variant="outlined" size="sm">
                  Mon compte
                </Button>
              </Link>
              <Link to={"#"}>
                <Button
                  variant="gradient"
                  color="red"
                  className="border border-red-500 font-medium dark:bg-black dark:text-white"
                  size="sm"
                  onClick={logout}
                >
                  Déconnexion
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Link to="/sign-in">
                <Button
                  onClick={handleLinkClick}
                  variant="outlined"
                  size="sm"
                  fullWidth
                  className="my-2 dark:bg-white dark:text-black"
                >
                  Connexion
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button onClick={handleLinkClick} size="sm" fullWidth>
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
