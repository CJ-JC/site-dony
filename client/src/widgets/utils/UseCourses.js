import { useState, useEffect } from "react";
import axios from "axios";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [availableRemises, setAvailableRemises] = useState([]);
  const [discountedCourses, setDiscountedCourses] = useState([]);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/course`);

        // Filtrer uniquement les cours publiés
        const publishedCourses = response.data.filter(
          (course) => course.isPublished,
        );

        // Trier les cours publiés par date de création
        const sortedCourses = publishedCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setCourses(sortedCourses);
      } catch (error) {
        setError("Erreur lors de la récupération des cours :", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/remise`);
        const remises = response.data;

        // Vérification pour les remises globales
        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          const expirationDate = new Date(globalRemise.expirationDate);
          const now = new Date();
          if (expirationDate > now) {
            setGlobalDiscount(globalRemise.discountPercentage);
          } else {
            setGlobalDiscount(null);
          }
        }

        // Filtrer et vérifier les remises spécifiques
        const validSpecificRemises = remises
          .filter((remise) => !remise.isGlobal)
          .filter((remise) => {
            const expirationDate = new Date(remise.expirationDate);
            return expirationDate > new Date();
          });

        setAvailableRemises(validSpecificRemises);
      } catch (error) {
        setError("Erreur lors de la récupération des remises :", error);
      }
    };

    fetchRemises();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      const updatedCourses = courses.map((course) => {
        let discountedPrice = course.price;

        // Appliquer la remise globale
        if (globalDiscount) {
          discountedPrice =
            course.price - (course.price * globalDiscount) / 100;
        }

        // Appliquer la remise spécifique
        const specificRemise = availableRemises.find(
          (remise) => remise.courseId === course.id,
        );
        if (specificRemise) {
          discountedPrice =
            course.price -
            (course.price * specificRemise.discountPercentage) / 100;
        }

        return {
          ...course,
          discountedPrice: parseFloat(discountedPrice).toFixed(2),
        };
      });

      // Mettre à jour les cours avec remises
      setDiscountedCourses(updatedCourses);
    }
  }, [courses, globalDiscount, availableRemises]);

  return { courses, discountedCourses, globalDiscount, availableRemises };
};

export default useCourses;
