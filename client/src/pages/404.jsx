import React from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <h1 className="text-9xl font-extrabold tracking-widest text-gray-900">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-orange-500 px-2 text-sm text-white">
        Page Non Trouvée
      </div>
      <button className="mt-5">
        <Link
          to="/"
          className="group relative inline-block text-sm font-medium text-orange-500 focus:outline-none focus:ring active:text-orange-500"
        >
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-orange-500 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <span className="relative block border border-current bg-white px-8 py-3">
            Retour à l'accueil
          </span>
        </Link>
      </button>
    </div>
  );
};

export default NotFound;
