import React from "react";
import Loading from "@/widgets/utils/Loading";
import CourseList from "@/components/CourseList";
import { Typography } from "@material-tailwind/react";

const Dashboard = ({ courseData, loading }) => {
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
        <CourseList courses={courseData} />
      </div>
    </div>
  );
};
export default Dashboard;
