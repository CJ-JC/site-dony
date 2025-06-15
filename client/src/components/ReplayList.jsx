import React from "react";
import ReactQuill from "react-quill";
import Select from "react-select";

const MasterclassVideo = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
  import.meta.env.VITE_AWS_REGION
}.amazonaws.com/`;

const ReplayList = ({
  replayData,
  loading,
  selectedOption,
  setSelectedOption,
  masterclassOptions,
}) => {
  const filteredReplays = selectedOption
    ? replayData.filter((r) => r.masterclass.id === selectedOption.value)
    : replayData;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: "#B0BEC5",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: "#B0BEC5",
      },
      backgroundColor: "transparent",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "gray",
    }),
    placeholder: (base) => ({
      ...base,
      color: "gray",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
    }),
  };

  return (
    <div className="mx-auto max-w-6xl py-5">
      {loading ? (
        <p className="text-center text-gray-900">Chargement des replays...</p>
      ) : replayData.length === 0 ? (
        <p className="text-center text-gray-900">
          Aucun replay disponible pour le moment.
        </p>
      ) : (
        <>
          {/* Sélecteur de masterclass */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold dark:text-white">
              Sélectionner une masterclass :
            </label>
            <Select
              options={masterclassOptions}
              onChange={setSelectedOption}
              value={selectedOption}
              className="max-w-sm text-black"
              placeholder="Toutes les masterclasses"
              styles={customStyles}
              isClearable
            />
          </div>

          {/* Liste des replays filtrés */}
          {filteredReplays.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReplays.map((replay) => (
                <div
                  key={replay.id}
                  className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <div className="relative aspect-video bg-gray-100">
                    <video
                      src={MasterclassVideo + replay.videoUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-4">
                    <h3 className="text-lg font-semibold text-[#40CBB4]">
                      {replay.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      📅{" "}
                      {new Date(replay.recordedAt).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="max-h-[100px] overflow-y-auto">
                      <ReactQuill
                        value={replay.description}
                        readOnly={true}
                        theme="bubble"
                        className="text-sm text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Aucun replay disponible pour cette masterclass.
            </p>
          )}
        </>
      )}
    </div>
  );
};
export default ReplayList;
