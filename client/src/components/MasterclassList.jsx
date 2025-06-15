import { Button } from "@material-tailwind/react";
import React from "react";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";

const MasterclassList = ({ masterclasses, loading }) => {
  const isExpired = new Date(masterclasses.endDate) < new Date();

  return (
    <div className="mx-auto max-w-6xl py-5">
      {loading ? (
        <p>Chargement...</p>
      ) : masterclasses.length === 0 ? (
        <p className="text-gray-500">Aucune formation achetée.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {masterclasses.map((mc) => (
            <div
              className="overflow-hidden rounded-xl border bg-white shadow transition"
              key={mc.id}
            >
              <div className="p-4">
                <h2 className="pl-2 text-lg">{mc.title}</h2>

                <ReactQuill
                  value={mc.description}
                  readOnly={true}
                  theme="bubble"
                  className="line-clamp-3 text-sm text-gray-700"
                />
                <p className="pl-2 text-xs italic text-gray-700">
                  Catégorie : {mc.category?.title}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <Link to={isExpired ? "#" : `${mc.link}`}>
                    <Button
                      variant="gradient"
                      size="sm"
                      disabled={isExpired}
                      className={
                        isExpired ? "cursor-not-allowed bg-gray-300" : ""
                      }
                    >
                      {isExpired ? "Formation expirée" : "Accéder au cours"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MasterclassList;
