import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  const [inputs, setInputs] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/user/signup`, inputs);
      setUser(response.data);
      navigate("/sign-in");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <section className="mx-auto flex h-auto w-full max-w-screen-xl items-center justify-center p-4 md:h-screen md:py-4 lg:justify-around">
        <div className="hidden w-2/5 overflow-hidden lg:block">
          <img
            src="/img/piano.jpg"
            alt="Image de piano"
            className="h-[200px] w-full rounded-3xl object-cover md:h-[600px]"
          />
        </div>

        <form
          className="mb-2 w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <Typography variant="h2" className="mb-4 font-bold">
              Rejoignez-nous
            </Typography>
          </div>
          <div className="mb-1 flex flex-col gap-4">
            <label
              htmlFor="lastname"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Nom
            </label>
            <Input
              size="lg"
              placeholder="Votre nom"
              className=" dark:text-white dark:focus:border-gray-50"
              name="lastName"
              id="lastname"
              type="text"
              onChange={handleChange}
              autoFocus
            />
            <label
              htmlFor="firstname"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Prénom
            </label>
            <Input
              size="lg"
              placeholder="Votre prénom"
              className=" dark:text-white dark:focus:border-gray-50"
              name="firstName"
              id="firstname"
              type="text"
              onChange={handleChange}
            />
            <label
              htmlFor="email"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Email
            </label>
            <Input
              size="lg"
              placeholder="Email"
              className=" dark:text-white dark:focus:border-gray-50"
              name="email"
              id="email"
              type="email"
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Mot de passe
            </label>
            <Input
              size="lg"
              placeholder="Votre mot de passe"
              className=" dark:text-white dark:focus:border-gray-50"
              name="password"
              id="password"
              type="password"
              onChange={handleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <Button
            type="submit"
            fullWidth
            onClick={handleSubmit}
            className="mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400"
          >
            S'inscrire
          </Button>

          <Typography
            variant="paragraph"
            className="mt-4 text-center font-medium text-blue-gray-500 dark:text-white"
          >
            Vous avez déjà un compte ?
            <Link
              to="/sign-in"
              className="ml-1 text-gray-900 dark:text-gray-300"
            >
              Connectez-vous
            </Link>
          </Typography>
        </form>
      </section>
    </>
  );
}

export default SignUp;

// cherley.joachim@gmail.com
