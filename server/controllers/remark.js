import { Course } from "../models/Course.js";
import { Remark } from "../models/Remark.js";
import { Video } from "../models/Video.js";
import { User } from "../models/User.js";

export const createRemark = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { userId, courseId, title, content, videoId } = req.body;

        // Validation des données d'entrée
        if (!title || !content) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Vérification de l'existence du cours
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Cours introuvable" });
        }

        // Vérification de l'existence de la vidéo
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: "Vidéo introuvable" });
        }

        // Création de la remarque
        const remark = await Remark.create({
            title,
            content,
            userId,
            courseId,
            videoId,
        });

        // Réponse en cas de succès
        res.status(201).json({
            message: "Remarque créée avec succès",
            data: remark,
        });
    } catch (error) {
        console.error("Erreur lors de la création de la remarque :", error);
        res.status(500).json({
            message: "Erreur interne lors de la création de la remarque",
            error: error.message, // Pour plus de détails lors du débogage
        });
    }
};

// Modification d'une remarque
export const updateRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, content } = req.body;

        const remark = await Remark.findOne({
            where: { id, userId },
            include: [{ model: User, as: "author", attributes: ["id", "firstName", "lastName"] }],
        });

        if (!remark) {
            return res.status(404).json({ message: "Remarque introuvable" });
        }

        remark.title = title || remark.title;
        remark.content = content || remark.content;
        await remark.save();

        res.status(200).json({ message: "Remarque mise à jour avec succès", data: remark });
    } catch (error) {
        console.error("Erreur lors de la modification de la remarque :", error);
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};

export const getRemarksByVideoId = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Récupération des remarques pour la vidéo spécifiée
        const remarks = await Remark.findAll({
            where: { videoId },
            include: [{ model: User, as: "author", attributes: ["id", "firstName", "lastName"] }],
        });

        res.status(200).json(remarks);
    } catch (error) {
        console.error("Erreur lors de la récupération des remarques :", error);
        res.status(500).json({
            message: "Erreur interne lors de la récupération des remarques",
            error: error.message,
        });
    }
};

export const deleteRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.body;

        const condition = userRole === "admin" ? { id } : { id, userId };

        const deleted = await Remark.destroy({
            where: condition,
        });

        if (deleted) {
            res.status(200).json({ message: "Remarque supprimée avec succès" });
        } else {
            res.status(403).json({
                message: "Vous n'êtes pas autorisé à supprimer cette remarque.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Erreur interne lors de la suppression de la remarque",
            error: error.message,
        });
    }
};
