import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";
import { Attachments } from "../models/Attachments.js";
import fs from "fs";
import { Op } from "sequelize";

export const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chapters" });
    }
};

export const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findOne({
            where: { id },
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
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapitre non trouvé" });
        }

        res.status(200).json(chapter);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération du chapitre",
            error: error.message,
        });
    }
};

export const createChapter = async (req, res) => {
    try {
        const { title, description, courseId } = req.body;
        let videos = [];

        // Convertir le champ "videos" en tableau JSON
        try {
            videos = JSON.parse(req.body.videos);
        } catch (error) {
            return res.status(400).json({ error: "Le format des vidéos est invalide." });
        }

        // Vérification des champs obligatoires
        if (!title || !description || !courseId || !Array.isArray(videos)) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        // Création du chapitre
        const chapter = await Chapter.create({
            title,
            description,
            courseId,
        });

        // Création des vidéos associées
        const videoPromises = videos.map((video) => {
            return Video.create({
                title: video.title,
                url: video.url,
                chapterId: chapter.id,
            });
        });

        const createdVideos = await Promise.all(videoPromises);

        // Traitement des fichiers d'annexe
        const files = req.files;
        if (files && files.length > 0) {
            const attachmentPromises = files.map(async (file, index) => {
                const filePath = `/uploads/attachments/${file.filename}`;
                const originalName = file.originalname;
                const videoIndex = req.body[`videoId${index}`];
                const videoId = videoIndex !== "" ? createdVideos[parseInt(videoIndex)]?.id : null;

                // Vérifier si un fichier avec le même nom existe déjà
                const existingAttachment = await Attachments.findOne({
                    where: {
                        title: originalName,
                        chapterId: chapter.id,
                    },
                });

                if (existingAttachment) {
                    // Supprimer l'ancien fichier physique
                    try {
                        fs.unlinkSync(`public${existingAttachment.fileUrl}`);
                    } catch (error) {
                        console.error("Erreur lors de la suppression de l'ancien fichier:", error);
                    }
                    // Supprimer l'enregistrement en base de données
                    await existingAttachment.destroy();
                }

                // Créer la nouvelle annexe
                return Attachments.create({
                    fileUrl: filePath,
                    title: originalName,
                    chapterId: chapter.id,
                    videoId: videoId,
                    courseId: courseId,
                });
            });

            await Promise.all(attachmentPromises);
        }

        // Récupération du chapitre avec ses vidéos et annexes
        const chapterWithData = await Chapter.findOne({
            where: { id: chapter.id },
            include: [
                {
                    model: Video,
                    attributes: ["id", "title", "url"],
                    include: [
                        {
                            model: Attachments,
                            as: "attachments",
                            attributes: ["id", "fileUrl", "title"],
                        },
                    ],
                },
            ],
        });

        res.status(201).json({
            message: "Chapitre, vidéos et annexes créés avec succès",
            chapter: chapterWithData,
        });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la création du chapitre: ${error.message}` });
    }
};

export const editChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, courseId } = req.body;
        let videos = [];

        // Parser les vidéos si elles sont présentes
        try {
            videos = JSON.parse(req.body.videos);
        } catch (error) {
            return res.status(400).json({ error: "Le format des vidéos est invalide" });
        }

        // 1. Mise à jour du chapitre
        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        // Vérification des champs obligatoires
        if (!title || !description || !courseId) {
            return res.status(400).json({ error: "Les champs titre, description et courseId sont obligatoires" });
        }

        await chapter.update({
            title,
            description,
            courseId,
        });

        // 2. Mise à jour des vidéos
        const existingVideos = await Video.findAll({
            where: { chapterId: id },
        });

        // Créer un map des vidéos existantes pour un accès rapide
        const existingVideosMap = new Map(existingVideos.map((video) => [video.id, video]));

        // Mettre à jour ou créer les vidéos
        const updatedVideos = await Promise.all(
            videos.map(async (video) => {
                if (video.id && existingVideosMap.has(video.id)) {
                    // Mettre à jour la vidéo existante
                    const existingVideo = existingVideosMap.get(video.id);
                    await existingVideo.update({
                        title: video.title,
                        url: video.url,
                    });
                    return existingVideo;
                } else {
                    // Créer une nouvelle vidéo si elle n'existe pas
                    return await Video.create({
                        title: video.title,
                        url: video.url,
                        chapterId: id,
                    });
                }
            })
        );

        // Supprimer les vidéos qui ne sont plus dans la liste
        const updatedVideoIds = updatedVideos.map((video) => video.id);
        await Video.destroy({
            where: {
                chapterId: id,
                id: {
                    [Op.notIn]: updatedVideoIds,
                },
            },
        });

        // 3. Gestion des annexes
        const files = req.files;
        if (files && files.length > 0) {
            const attachmentPromises = files.map(async (file, index) => {
                const filePath = `/uploads/attachments/${file.filename}`;
                const originalName = file.originalname;
                const videoIndex = req.body[`videoId${index}`];
                const videoId = videoIndex !== "" ? updatedVideos[parseInt(videoIndex)]?.id : null;

                // Vérifier si un fichier avec le même nom existe déjà
                const existingAttachment = await Attachments.findOne({
                    where: {
                        title: originalName,
                        chapterId: id,
                    },
                });

                if (existingAttachment) {
                    // Supprimer l'ancien fichier physique
                    try {
                        fs.unlinkSync(`public${existingAttachment.fileUrl}`);
                    } catch (error) {
                        console.error("Erreur lors de la suppression de l'ancien fichier:", error);
                    }
                    // Supprimer l'enregistrement en base de données
                    await existingAttachment.destroy();
                }

                // Créer la nouvelle annexe
                return Attachments.create({
                    fileUrl: filePath,
                    title: originalName,
                    chapterId: id,
                    videoId: videoId,
                    courseId: courseId,
                });
            });

            await Promise.all(attachmentPromises);
        }

        // Récupérer le chapitre mis à jour avec ses vidéos et annexes
        const updatedChapter = await Chapter.findOne({
            where: { id },
            include: [
                {
                    model: Video,
                    attributes: ["id", "title", "url"],
                    include: [
                        {
                            model: Attachments,
                            as: "attachments",
                            attributes: ["id", "fileUrl", "title"],
                        },
                    ],
                },
            ],
        });

        res.status(200).json({
            message: "Chapitre, vidéos et annexes mis à jour avec succès",
            chapter: updatedChapter,
        });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            error: `Erreur lors de la mise à jour du chapitre: ${error.message}`,
        });
    }
};

export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        // Récupérer et supprimer les fichiers d'annexe
        const attachments = await Attachments.findAll({
            where: { chapterId: id },
        });

        // Supprimer les fichiers physiques
        for (const attachment of attachments) {
            try {
                fs.unlinkSync(`public${attachment.fileUrl}`);
            } catch (error) {
                console.error("Erreur lors de la suppression du fichier:", error);
            }
        }

        // Supprimer les vidéos associées
        await Video.destroy({
            where: { chapterId: id },
        });

        // Supprimer les annexes en base de données
        await Attachments.destroy({
            where: { chapterId: id },
        });

        // Supprimer le chapitre
        await chapter.destroy();

        res.status(200).json({ message: "Chapitre et tous ses éléments associés supprimés avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du chapitre: ${error.message}`,
        });
    }
};
