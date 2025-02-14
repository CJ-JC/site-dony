import { Link } from "react-router-dom";
import logoDay from "/img/logo-day.svg";
import logoNight from "/img/logo-night.svg";

const year = new Date().getFullYear();

export function Footer({ theme }) {
  return (
    <footer className="mx-auto w-full max-w-screen-xl border-t p-4 md:p-0 md:py-4">
      <div className="container mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://donymusic.com/"
            className="mb-4 flex items-center space-x-3 rtl:space-x-reverse sm:mb-0"
          >
            {theme === "dark" ? (
              <img src={logoNight} width={200} alt="logo donymusic" />
            ) : (
              <img src={logoDay} width={200} alt="logo donymusic" />
            )}
          </a>
          <ul className="mb-6 flex flex-wrap items-center justify-center text-sm text-blue-gray-500 dark:text-white sm:mb-0">
            <Link to={"/cgv"} className="me-4 hover:underline md:me-6">
              CGV
            </Link>
            <Link to={"/cgu"} className="me-4 hover:underline md:me-6">
              CGU
            </Link>
            <Link to={"/politique"} className="me-4 hover:underline md:me-6">
              Politique de confidentialité
            </Link>
          </ul>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-4" />
        <span className="block text-center text-sm text-blue-gray-500 dark:text-white">
          © {year} {""}
          <a href="https://www.donymusic.fr" className="hover:underline">
            Donymusic
          </a>
          . Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
