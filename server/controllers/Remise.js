import { Course } from "../models/Course.js";
import { Remise } from "../models/Remise.js";

export const createRemise = async (req, res) => {
    const { discountPercentage, expirationDate, courseId, isGlobal } = req.body;

    try {
        // Validation des entrées
        if (!discountPercentage || !expirationDate) {
            return res.status(400).json({ error: "Tous les champs requis doivent être remplis." });
        }

        // Si la remise est globale, le champ courseId doit être null
        const remiseData = {
            discountPercentage,
            expirationDate,
            courseId: isGlobal ? null : courseId,
            isGlobal: isGlobal ? 1 : 0, // S'assurer que `isGlobal` est bien 1 ou 0
        };

        // Création de la remise
        const remise = await Remise.create(remiseData);

        res.status(201).json(remise);
    } catch (error) {
        console.error("Erreur lors de la création de la remise :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la remise." });
    }
};

export const applyRemise = async (req, res) => {
    const { discountPercentage, courseId } = req.body;

    try {
        // Récupérer la remise
        const remise = await Remise.findOne({ where: { discountPercentage } });

        if (!remise) {
            return res.status(404).json({ error: "remise introuvable." });
        }

        // Vérification de la validité de la remise
        const now = new Date();
        if (new Date(remise.expirationDate) < now) {
            return res.status(400).json({ error: "Remise expirée." });
        }

        if (courseId) {
            // Cas : Remise appliquée à un cours spécifique
            const course = await Course.findByPk(courseId);

            if (!course) {
                return res.status(404).json({ error: "Cours introuvable." });
            }

            const originalPrice = course.price;
            const discountedPrice = course.price - (course.price * remise.discountPercentage) / 100;

            return res.json({
                courses: [
                    {
                        courseId: course.id,
                        title: course.title,
                        originalPrice,
                        discountedPrice,
                    },
                ],
            });
        } else {
            // Cas : Remise global
            const courses = await Course.findAll({
                where: { isPublished: true },
            });

            if (!courses || courses.length === 0) {
                return res.status(404).json({
                    error: "Aucun cours disponible pour appliquer le coupon global.",
                });
            }

            // Appliquer la réduction à chaque cours
            const discountedCourses = courses.map((course) => ({
                courseId: course.id,
                title: course.title,
                originalPrice: course.price,
                discountedPrice: course.price - (course.price * remise.discountPercentage) / 100,
            }));

            return res.json({ courses: discountedCourses });
        }
    } catch (err) {
        console.error("Erreur lors de l'application de la remise :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

export const getCoursePriceWithGlobalDiscount = async (courseId) => {
    const course = await Course.findByPk(courseId, {
        include: {
            model: Remise,
            as: "remises",
            where: { isGlobal: true },
            required: false, // Inclure les cours même sans remise global
        },
    });

    if (!course) {
        throw new Error("Course not found");
    }

    if (course.remises.length > 0) {
        const remise = course.remises[0]; // Prendre le premier remise global applicable
        const discount = course.price * (remise.discountPercentage / 100);
        const discountedPrice = Math.max(0, course.price - discount);
        return { originalPrice: course.price, discountedPrice, remise };
    }

    return { originalPrice: course.price, discountedPrice: course.price };
};

export const getRemises = async (req, res) => {
    try {
        const remises = await Remise.findAll({
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title"],
                },
            ],
        });
        res.json(remises);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des remises." });
    }
};

export const getRemisesForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Trouver le cours via le slug
        const course = await Course.findOne({
            where: { slug: courseId },
            attributes: ["id", "title"],
        });

        if (!course) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        // Récupérer les remises pour ce cours
        const remises = await Remise.findAll({
            where: { courseId: course.id },
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title"],
                },
            ],
        });
        res.json(remises); // Retourne les remises associées au cours
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des remises pour ce cours." });
    }
};

export const deleteRemise = async (req, res) => {
    try {
        const { id } = req.params;
        const remise = await Remise.findByPk(id);
        if (!remise) {
            return res.status(404).json({ error: "Remise introuvable." });
        }

        await remise.destroy();

        res.status(200).json({ message: "Remise supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la remise." });
    }
};
