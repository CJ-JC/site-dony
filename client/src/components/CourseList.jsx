import { Typography } from "@material-tailwind/react";
import CourseCard from "./CourseCard";

const CourseList = ({ courses }) => {
  return (
    <>
      <div className="my-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl}
            chaptersLength={course.chapters.length}
            chapters={course.chapters}
            price={course.price}
            videoUrl={course.videoUrl}
            slug={course.slug}
            discountedPrice={course.discountedPrice}
            category={course.category.title}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <section className="mb-12 flex flex-col items-center justify-center">
          <Typography
            variant="h2"
            color="blue-gray"
            className="mb-6 p-4 text-center text-2xl font-extrabold dark:text-white"
          >
            Aucune formation trouvée.
          </Typography>
        </section>
      )}
    </>
  );
};

export default CourseList;
