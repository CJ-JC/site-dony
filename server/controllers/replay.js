import { Replays } from "../models/Replays.js";
import "../config/dotenv.js";
import { putObject } from "../util/putObject.js";
import { Masterclass } from "../models/Masterclass.js";
import { deleteObject } from "../util/deleteObject.js";
import { Purchase } from "../models/Purchase.js";
import { Op } from "sequelize";

export const getReplaysByMasterclass = async (req, res) => {
    const { slug } = req.params;

    try {
        // 1. Trouver la masterclass avec ce slug
        const masterclass = await Masterclass.findOne({
            where: { slug },
        });

        if (!masterclass) {
            return res.status(404).json({ error: "Masterclass introuvable" });
        }

        // 2. Récupérer les replays liés à cette masterclass
        const replays = await Replays.findAll({
            where: { masterclassId: masterclass.id },
            include: [
                {
                    model: Masterclass,
                    as: "masterclass",
                    attributes: ["id", "title", "slug"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(replays);
    } catch (error) {
        console.error("Erreur récupération replays par masterclass :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const createReplay = async (req, res) => {
    try {
        const { title, description, masterclassId, recordedAt } = req.body;
        const file = req.files?.file;
        console.log(recordedAt);

        if (!title || !description || !masterclassId || !recordedAt || !file) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        const extension = file.name.split(".").pop();
        const fileName = `replays/${Date.now()}-${title.replace(/\s+/g, "-")}.${extension}`;

        // Upload vers S3
        const uploadResult = await putObject(file.data, fileName);

        if (!uploadResult) {
            return res.status(500).json({ error: "Erreur lors de l'upload de la vidéo." });
        }

        // Enregistrement en BDD
        const replay = await Replays.create({
            title,
            description,
            videoUrl: uploadResult.key,
            masterclassId,
            recordedAt: recordedAt,
        });

        res.status(201).json(replay);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du replay" });
    }
};

export const getReplay = async (req, res) => {
    const { id } = req.params;

    try {
        const replay = await Replays.findOne({
            where: { id },
            include: [
                {
                    model: Masterclass,
                    as: "masterclass",
                    attributes: ["id", "title", "slug"],
                },
            ],
        });

        if (!replay) {
            return res.status(404).json({ error: "Replay non trouvé" });
        }

        res.status(200).json(replay);
    } catch (error) {
        console.error("Erreur lors de la récupération du replay :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getUserReplays = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Non autorisé. Veuillez vous connecter." });
        }

        // Récupérer les achats validés du type masterclass
        const purchases = await Purchase.findAll({
            where: {
                userId,
                itemType: "masterclass",
                status: "completed",
            },
        });

        const masterclassIds = purchases.map((p) => p.itemId);

        if (masterclassIds.length === 0) {
            return res.status(200).json({ message: "Aucune masterclass achetée.", replays: [] });
        }

        // Rechercher les replays associés
        const replays = await Replays.findAll({
            where: {
                masterclassId: {
                    [Op.in]: masterclassIds,
                },
                isPublished: true,
            },
            include: [
                {
                    model: Masterclass,
                    as: "masterclass",
                    attributes: ["id", "title", "slug"],
                },
            ],
            order: [["recordedAt", "ASC"]],
        });

        return res.status(200).json({ replays });
    } catch (error) {
        console.error("Erreur récupération replays :", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateReplay = async (req, res) => {
    const { id } = req.params;

    try {
        const { title, description, recordedAt, masterclassId } = req.body;
        const file = req.files?.file;
        console.log(recordedAt);

        if (!title || !description || !recordedAt || !masterclassId) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        const replay = await Replays.findOne({ where: { id } });

        if (!replay) {
            return res.status(404).json({ error: "Replay introuvable." });
        }

        let videoPath = replay.videoUrl;

        // Si un nouveau fichier est uploadé, supprimer l'ancien
        if (file) {
            if (videoPath) {
                const deleteResult = await deleteObject(videoPath);
                if (deleteResult.status !== 204) {
                    return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne vidéo." });
                }
            }

            const extension = file.name.split(".").pop();
            const fileName = `replays/${Date.now()}-${title.replace(/\s+/g, "-")}.${extension}`;

            const uploadResult = await putObject(file.data, fileName);
            if (!uploadResult) {
                return res.status(500).json({ error: "Erreur lors de l'upload de la vidéo." });
            }

            videoPath = uploadResult.key;
        }

        await Replays.update(
            {
                title,
                description,
                recordedAt: recordedAt,
                masterclassId,
                videoUrl: videoPath,
            },
            { where: { id } }
        );

        res.status(200).json({ message: "Replay modifié avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const togglePublishReplay = async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;

    try {
        const replay = await Replays.findByPk(id);
        if (!replay) {
            return res.status(404).json({ error: "Replay introuvable" });
        }

        replay.isPublished = isPublished;
        await replay.save();

        res.status(200).json({ message: "Statut mis à jour", isPublished: replay.isPublished });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const deleteReplay = async (req, res) => {
    try {
        const { id } = req.params;
        const replay = await Replays.findByPk(id);
        if (!replay) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        await replay.destroy();

        // Supprimez l'ancienne image sur S3
        const deleteResult = await deleteObject(replay.videoUrl);

        if (deleteResult.status !== 204) {
            return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne vidéo." });
        }

        res.status(200).json({ message: "Cours supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du cours: ${error.message}`,
        });
    }
};
