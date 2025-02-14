import { Course } from "../models/Course.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";
import { Video } from "../models/Video.js";

export const createNote = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { userId, courseId, content, videoId } = req.body;

        // Validation des données d'entrée
        if (!content) {
            return res.status(400).json({ message: "Le contenu est requis" });
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
        const note = await Note.create({
            content,
            userId,
            courseId,
            videoId,
        });

        return res.status(201).json(note);
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getNotes = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { courseId } = req.query;

        const notes = await Note.findAll({
            where: {
                userId,
                courseId,
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const { content } = req.body;

        const note = await Note.findOne({
            where: { id, userId },
            include: [{ model: User, as: "author" }],
        });

        if (!note) {
            return res.status(404).json({ message: "Note introuvable" });
        }

        await note.update({
            content,
        });

        return res.status(200).json(note);
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        // Récupération des données de la requête
        const { noteId } = req.params;

        const note = await Note.findByPk(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note introuvable" });
        }

        await note.destroy();

        return res.status(204).json({ message: "Note supprimée" });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
