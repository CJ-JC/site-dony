import { Chapter } from "../models/Chapter.js";
import { UserProgress } from "../models/UserProgress.js";
import { Video } from "../models/Video.js";

export const upsertUserProgress = async (req, res) => {
    try {
        const { userId, chapterId, progress, isComplete, videoId } = req.body;

        // Vérifier si un enregistrement existe
        let userProgress = await UserProgress.findOne({
            where: { userId, chapterId, videoId },
        });

        if (userProgress) {
            // Mettre à jour la progression (permet d'augmenter ou diminuer)
            userProgress = await userProgress.update({ progress, isComplete });
        } else {
            // Créer un nouvel enregistrement
            userProgress = await UserProgress.create({
                userId,
                chapterId,
                progress,
                isComplete,
                videoId,
            });
        }

        res.status(200).json(userProgress);
    } catch (error) {
        console.error("Erreur lors de la gestion de la progression utilisateur :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const courseId = req.params.courseId;

        if (!courseId) {
            return res.status(400).json({
                progress: 0,
                isComplete: false,
                message: "L'identifiant du cours est manquant",
            });
        }

        if (!userId) {
            return res.status(200).json({
                progress: 0,
                isComplete: false,
                message: "Utilisateur non connecté",
            });
        }

        // Récupérer tous les chapitres du cours
        const chapters = await Chapter.findAll({ where: { courseId } });
        if (chapters.length === 0) {
            return res.status(200).json({
                progress: 0,
                isComplete: false,
                message: "Aucun chapitre trouvé pour ce cours",
            });
        }

        // Récupérer toutes les vidéos du cours
        const chapterIds = chapters.map((chapter) => chapter.id);
        const totalVideos = await Video.findAll({
            where: { chapterId: chapterIds },
        });

        if (totalVideos.length === 0) {
            return res.status(200).json({
                progress: 0,
                isComplete: false,
                message: "Aucune vidéo trouvée pour ce cours",
            });
        }

        // Récupérer les vidéos complétées par l'utilisateur
        const userProgresses = await UserProgress.findAll({
            where: { userId, videoId: totalVideos.map((video) => video.id), isComplete: true },
        });

        const completedVideosCount = userProgresses.length;

        // Calculer la progression globale
        const progressPercentage = Math.round((completedVideosCount / totalVideos.length) * 100);

        res.status(200).json({
            progress: progressPercentage,
            isComplete: completedVideosCount === totalVideos.length,
            totalVideos: totalVideos.length,
            completedVideos: completedVideosCount,
            message: "Progression calculée avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression utilisateur :", error);
        res.status(500).json({
            progress: 0,
            isComplete: false,
            message: "Erreur interne lors de la récupération de la progression",
        });
    }
};

export const updateUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const chapterId = req.params.chapterId;
        const isComplete = req.body.isComplete;
        const progress = req.body.progress;

        const userProgress = await userProgress.findOne({
            where: { userId, chapterId },
            include: [
                {
                    model: user,
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Chapter,
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!userProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }

        await userProgress.update({
            isComplete,
            progress,
        });

        res.status(200).json({ message: "User progress updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user progress" });
    }
};

export const getVideoProgress = async (req, res) => {
    try {
        const userId = req.user?.id; // Vérifier si l'utilisateur est authentifié
        const videoId = req.params.videoId; // ID de la vidéo depuis les paramètres

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Rechercher la progression de l'utilisateur pour cette vidéo
        const videoProgress = await UserProgress.findOne({
            where: {
                userId: userId,
                videoId: videoId,
            },
        });

        // Si aucune progression n'est trouvée, renvoyer une réponse par défaut
        if (!videoProgress) {
            return res.status(200).json({
                isComplete: false,
                progress: 0,
                message: "Aucune progression trouvée pour cette vidéo.",
            });
        }

        // Retourner les détails de la progression existante
        res.status(200).json({
            isComplete: videoProgress.isComplete,
            progress: videoProgress.progress,
            id: videoProgress.id,
            userId: videoProgress.userId,
            videoId: videoProgress.videoId,
            chapterId: videoProgress.chapterId,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression de la vidéo :", error);
        res.status(500).json({
            message: "Erreur lors de la récupération de la progression de la vidéo",
            error: error.message,
        });
    }
};

export const deleteCourseProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const courseId = req.params.courseId;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Récupérer tous les chapitres du cours
        const chapters = await Chapter.findAll({ where: { courseId } });
        const chapterIds = chapters.map((chapter) => chapter.id);

        // Récupérer toutes les vidéos des chapitres
        const videos = await Video.findAll({
            where: { chapterId: chapterIds },
        });
        const videoIds = videos.map((video) => video.id);

        // Supprimer toutes les progressions pour ces vidéos
        const deleted = await UserProgress.destroy({
            where: {
                userId: userId,
                videoId: videoIds,
            },
        });

        res.status(200).json({
            message: "Progression du cours réinitialisée avec succès",
            deletedCount: deleted,
        });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation de la progression :", error);
        res.status(500).json({
            message: "Erreur lors de la réinitialisation de la progression",
            error: error.message,
        });
    }
};
