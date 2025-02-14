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
        <p className="text-center">Aucune formation trouvée.</p>
      )}
    </>
  );
};

export default CourseList;
