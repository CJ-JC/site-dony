import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseProgress from "@/widgets/utils/Course-progress";

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  chapters,
  price,
  slug,
  discountedPrice,
  category,
}) => {
  const CoursesImage = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/`;

  const [color, setColor] = useState("#FF6C02");
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${BASE_URL}/api/payment/check-purchase?id=${id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setHasPurchasedCourse(response.data.hasPurchasedCourse);
        }
      } catch (error) {
        setError("Erreur lors de la vérification de l'achat.");
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user-progress/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProgress(response.data.progress);
      } catch (error) {
        if (error.response?.status === 401) {
          setProgress(null);
        } else {
          setError("Erreur lors de la récupération de la progression.");
        }
      }
    };

    checkPurchase();
    fetchProgress();
  }, [id]);

  useEffect(() => {
    if (category === "Piano") {
      setColor("crimson");
    } else if (category === "Guitare") {
      setColor("#023047");
    } else if (category === "Batterie") {
      setColor("#2d6a4f");
    } else {
      setColor("#FF6C02");
    }
  }, [category]);

  // Je veux récupérer l'url de la page user/account
  const linkUserAccount = window.location.href;

  return (
    <>
      <Link
        to={
          linkUserAccount.includes("user/account")
            ? `/course-player/course/${id}/chapters/${chapters[0].id}`
            : `/detail/slug/${slug}`
        }
        key={id}
      >
        <article className="pt-30 relative isolate mx-auto flex h-72 max-w-sm flex-col justify-end overflow-hidden rounded-2xl border px-4 pb-4 transition duration-500 ease-in-out hover:scale-105 dark:border-white/30">
          <img
            alt={title}
            src={`${CoursesImage}${imageUrl}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {progress === 100 && (
            <div className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Trophy className="text-xl text-[#ffd700]" />
            </div>
          )}
          {/* <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-gray-900"></div> */}
          <div className="absolute inset-0 bg-black/70"></div>
          <h3 className="z-10 text-xl font-medium text-white">{title}</h3>
          <div className="z-10 my-2 flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-full bg-light-blue-50 p-1">
              <BookOpen className="text-green-500" />
            </div>
            <span className="text-white">
              {chaptersLength > 1
                ? `${chaptersLength} Chapitres`
                : `${chaptersLength} Chapitre`}
            </span>
          </div>
          {hasPurchasedCourse ? (
            <CourseProgress size="sm" value={progress} />
          ) : (
            <p className="text-md z-10 font-medium text-white md:text-sm">
              {!hasPurchasedCourse &&
                (discountedPrice && discountedPrice < price ? (
                  <>
                    <span className="text-lg text-gray-300 line-through">
                      {price}€
                    </span>
                    <span className="ml-2 text-lg text-white">
                      {discountedPrice}€
                    </span>
                  </>
                ) : (
                  <span className="text-lg text-white">{price}€</span>
                ))}
            </p>
          )}
          <span
            style={{ backgroundColor: color, display: "block" }}
            className={`absolute bottom-5 right-0 mr-3 mt-3 rounded-full px-2 py-1 text-sm font-medium text-white`}
          >
            {category}
          </span>
        </article>
      </Link>
    </>
  );
};

export default CourseCard;
