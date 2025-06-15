import { Course } from "../models/Course.js";
import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";
import { Category } from "../models/Category.js";
import { Purchase } from "../models/Purchase.js";
import { UserProgress } from "../models/UserProgress.js";
import Attachments from "../models/Attachments.js";
import { putObject } from "../util/putObject.js";
import { deleteObject } from "../util/deleteObject.js";
import "../config/dotenv.js";
import { getObject } from "../util/getObject.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            attributes: ["id", "title", "description", "price", "videoUrl", "imageUrl", "slug", "createdAt", "isPublished"],
            // where: {
            //     isPublished: true,
            // },
            include: [
                {
                    model: Chapter,
                    attributes: ["id", "title", "description"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                            include: [
                                {
                                    model: Attachments,
                                    as: "attachments",
                                    attributes: ["id", "fileUrl", "title"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
                },
            ],
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des cours" });
    }
};

export const getCourseByUserId = async (req, res) => {
    try {
        const userId = req.user?.id; // ID de l'utilisateur connecté
        const userRole = req.user?.role; // Rôle de l'utilisateur connecté
        const { id } = req.params; // ID du cours demandé

        if (!userId) {
            return res.status(401).json({ message: "Non autorisé. Veuillez vous connecter." });
        }

        // Vérification du rôle administrateur
        if (userRole === "admin") {
            // L'utilisateur est un administrateur, il a accès au cours sans restriction
            const course = await Course.findOne({
                where: { id },
                include: [
                    {
                        model: Chapter,
                        include: [
                            {
                                model: Video,
                                attributes: ["id", "url", "title"],
                                include: [
                                    {
                                        model: Attachments,
                                        as: "attachments",
                                        attributes: ["id", "fileUrl", "title"],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: Category,
                        as: "category",
                        attributes: ["id", "title"],
                    },
                ],
            });

            if (!course) {
                return res.status(404).json({ message: "Cours non trouvé" });
            }

            // Aucun besoin de vérifier les progrès ou les achats pour les administrateurs
            return res.status(200).json({
                ...course.toJSON(),
                lastViewedVideoId: null,
                lastViewedChapterId: null,
            });
        }

        // Vérifier si l'utilisateur a acheté le cours
        const purchase = await Purchase.findOne({
            where: {
                userId,
                itemId: id,
                itemType: "course",
                status: "completed", // Seuls les achats complétés sont valides
            },
        });

        if (!purchase) {
            return res.status(403).json({ message: "Accès interdit. Cours non acheté." });
        }

        // Récupérer les détails du cours
        const course = await Course.findOne({
            where: { id },
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        // Récupérer le dernier progrès de l'utilisateur
        const lastViewedProgress = await UserProgress.findOne({
            where: { userId },
            include: [
                {
                    model: Video,
                    attributes: ["id", "chapterId"],
                    include: [
                        {
                            model: Chapter,
                            attributes: ["id"],
                            where: { courseId: id },
                        },
                    ],
                },
            ],
            order: [["updatedAt", "DESC"]],
            attributes: ["videoId", "chapterId"],
        });

        res.status(200).json({
            ...course.toJSON(),
            lastViewedVideoId: lastViewedProgress?.videoId || null,
            lastViewedChapterId: lastViewedProgress?.chapterId || null,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({
            where: { id },
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                            include: [
                                {
                                    model: Attachments,
                                    as: "attachments",
                                    attributes: ["id", "fileUrl", "title"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Erreur lors de la récupération du cours:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getUserSubscribedCourses = async (req, res) => {
    try {
        const userId = req.user?.id; // ID de l'utilisateur connecté

        if (!userId) {
            return res.status(401).json({ message: "Non autorisé. Veuillez vous connecter." });
        }

        // Récupérer les IDs des cours souscrits via les achats complétés
        const purchases = await Purchase.findAll({
            where: {
                userId,
                itemType: "course",
                status: "completed",
            },
            attributes: ["itemId", "createdAt"],
        });

        const courseIds = purchases.map((purchase) => purchase.itemId);

        if (courseIds.length === 0) {
            return res.status(200).json({ message: "Aucun cours souscrit.", courses: [] });
        }

        // Récupérer les détails des cours souscrits
        const courses = await Course.findAll({
            where: { id: courseIds },
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "title", "url"],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
                },
            ],
        });

        res.status(200).json({ courses, purchases, courseIds });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { title, slug, description, price, videoUrl, categoryId, file } = req.body;

        // Validation des champs obligatoires
        if (!title || !price || !description || !videoUrl || !file || !categoryId) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        // Vérifiez que la catégorie existe
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "La catégorie spécifiée est introuvable." });
        }

        // Vérifiez les doublons
        const existingCourse = await Course.findOne({ where: { title } });
        if (existingCourse) {
            return res.status(400).json({ error: "Un cours avec ce nom existe déjà." });
        }

        // Upload de l'image sur S3
        const fileBuffer = Buffer.from(file, "base64");
        const fileName = `images/${Date.now()}-${slug}.jpg`;
        const uploadResult = await putObject(fileBuffer, fileName);

        if (!uploadResult) {
            return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
        }

        // Enregistrer le Key dans la base de données
        const newCourse = await Course.create({
            imageUrl: uploadResult.key,
            title,
            slug: slug.toLowerCase(),
            description,
            price: parseFloat(price),
            videoUrl,
            categoryId: parseInt(categoryId),
        });

        res.status(201).json({ message: "Cours créé avec succès", result: newCourse });
    } catch (error) {
        // Suppression de l'image sur S3 en cas d'erreur
        if (error.name === "SequelizeUniqueConstraintError") {
            const details = error.errors.map((e) => e.message);
            return res.status(400).json({ error: `Erreur de validation : ${details.join(", ")}` });
        }

        res.status(500).json({ error: `Erreur lors de la création du cours : ${error.message}` });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, price, videoUrl, categoryId, file } = req.body;

        // Vérification des champs obligatoires
        if (!title || !slug || !description || !price || !videoUrl || !categoryId) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        // Vérifiez que la catégorie existe
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "La catégorie spécifiée est introuvable." });
        }

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        // Vérification si le prix est un nombre valide
        if (isNaN(parseFloat(price))) {
            return res.status(400).json({ error: "Le prix doit être un nombre valide" });
        }

        let imagePath = course.imageUrl;

        // Vérifiez d'abord s'il y a une ancienne image à supprimer
        if (imagePath && file) {
            // Supprimez l'ancienne image sur S3
            const deleteResult = await deleteObject(imagePath);

            if (deleteResult.status !== 204) {
                return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
            }
        }

        // Upload de la nouvelle image si elle est présente dans la requête
        if (file) {
            const fileBuffer = Buffer.from(file, "base64");
            const fileName = `images/${Date.now()}-${id}.jpg`;

            // Upload de l'image sur S3
            const uploadResult = await putObject(fileBuffer, fileName);

            if (!uploadResult) {
                return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
            }

            imagePath = uploadResult.key;
        }

        const [rowsUpdated, updatedCourses] = await Course.update(
            {
                title,
                slug: slug.toLowerCase(),
                description,
                imageUrl: imagePath,
                price: parseFloat(price),
                videoUrl,
                categoryId: parseInt(categoryId),
            },
            {
                where: { id },
                returning: true,
            }
        );

        // Vérifiez si des lignes ont été mises à jour
        if (rowsUpdated === 0 || updatedCourses.length === 0) {
            return res.status(404).json({ error: "Cours non trouvé ou aucune modification détectée." });
        }

        // Retourner le premier cours mis à jour
        res.status(200).json({ message: "Cours mis à jour avec succès", result: updatedCourses[0] });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cours :", error);
        res.status(500).json({ error: `Erreur lors de la mise à jour du cours : ${error}` });
    }
};

export const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({
            where: { slug },
            attributes: ["id", "title", "description", "price", "videoUrl", "imageUrl", "slug"],
            include: [
                {
                    model: Chapter,
                    attributes: ["id", "title", "description"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                            include: [
                                {
                                    model: Attachments,
                                    as: "attachments",
                                    attributes: ["id", "fileUrl", "title"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du cours" });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        await course.destroy();

        // Supprimez l'ancienne image sur S3
        const deleteResult = await deleteObject(course.imageUrl);

        if (deleteResult.status !== 204) {
            return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
        }

        await Video.destroy({ where: { chapterId: id } });

        res.status(200).json({ message: "Cours supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du cours: ${error.message}`,
        });
    }
};

export const togglePublishCourse = async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Cours introuvable" });
        }

        course.isPublished = isPublished;
        await course.save();

        res.status(200).json({ message: "Statut mis à jour", isPublished: course.isPublished });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};
