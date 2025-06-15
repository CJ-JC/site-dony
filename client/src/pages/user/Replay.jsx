import React from "react";
import Loading from "@/widgets/utils/Loading";
import { Typography } from "@material-tailwind/react";
import ReplayList from "@/components/ReplayList";

const Replay = ({
  replayData,
  loading,
  selectedOption,
  setSelectedOption,
  masterclassOptions,
}) => {
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto">
      <Typography variant="h4" className="dark:text-white">
        Vos formations
      </Typography>
      <p className="text-gray-600 dark:text-white">
        Les formations que vous avez souscrit sont affichées ci-dessous.
      </p>
      <div className="p-0 md:p-2">
        <ReplayList
          replayData={replayData}
          loading={loading}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          masterclassOptions={masterclassOptions}
        />
      </div>
    </div>
  );
};
export default Replay;
