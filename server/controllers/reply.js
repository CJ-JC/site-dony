import { Remark } from "../models/Remark.js";
import { Video } from "../models/Video.js";
import { User } from "../models/User.js";
import { Reply } from "../models/Reply.js";

export const createReply = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { userId, remarkId, content, videoId } = req.body;

        // Validation des données d'entrée
        if (!content) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Vérification de l'existence du cours
        const remark = await Remark.findByPk(remarkId);
        if (!remark) {
            return res.status(404).json({ message: "Remark introuvable" });
        }

        // Vérification de l'existence de la vidéo
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: "Vidéo introuvable" });
        }

        // Création de la réponse
        const reply = await Reply.create({
            userId,
            content,
            remarkId,
            videoId,
        });

        // Réponse en cas de succès
        res.status(201).json({
            message: "Réponse créée avec succès",
            data: reply,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur interne lors de la création de la réponse",
            error: error.message,
        });
    }
};

export const updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { content } = req.body;

        // Recherchez la réponse à modifier
        const existingReply = await Reply.findOne({
            where: { id, userId },
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: ["id", "firstName", "lastName"],
                },
            ],
        });

        if (!existingReply) {
            return res.status(404).json({ message: "Réponse introuvable" });
        }

        // Mettez à jour le contenu
        existingReply.content = content || existingReply.content;
        await existingReply.save();

        return res.status(200).json({
            message: "Réponse mise à jour avec succès",
            data: existingReply,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};

export const getRepliesByVideoId = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Récupérer toutes les réponses pour un videoId
        const replies = await Reply.findAll({
            where: { videoId },
            include: [{ model: User, as: "author", attributes: ["id", "firstName", "lastName", "role"] }],
        });

        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({
            message: "Erreur interne lors de la récupération des réponses",
            error: error.message,
        });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.body;

        const condition = userRole === "admin" ? { id } : { id, userId };

        const deleted = await Reply.destroy({
            where: condition,
        });

        if (deleted) {
            res.status(200).json({ message: "Réponse supprimée avec succès" });
        } else {
            res.status(403).json({
                message: "Vous n'êtes pas autorisé à supprimer cette réponse.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Erreur interne lors de la suppression de la réponse",
            error: error.message,
        });
    }
};
