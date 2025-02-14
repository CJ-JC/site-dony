import { Progress } from "@material-tailwind/react";
import React from "react";

const CourseProgress = ({ value }) => {
  const progressValue = value !== null ? value : 0;

  return (
    <div className="z-10">
      <Progress className="h-1" color="green" value={progressValue} />
      <p className="bg-slate-50 mt-2 w-max rounded-md p-1 font-medium text-white">
        {Math.round(progressValue)}% Compléter
      </p>
    </div>
  );
};

export default CourseProgress;
