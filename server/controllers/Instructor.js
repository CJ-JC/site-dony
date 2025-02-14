import { Instructor } from "../models/Instructor.js";
import fs from "fs";

export const getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.findAll();
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des instructeurs" });
    }
};

export const createInstructor = async (req, res) => {
    try {
        const { name, biography } = req.body;
        const imagePath = req.file ? `/uploads/instructors/${req.file.filename}` : null;

        // Vérification des champs obligatoires
        if (!name || !biography) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier si l'image existe déjà
        const existingImage = await Instructor.findOne({ where: { name } });
        if (existingImage) {
            fs.unlinkSync(`public${imageUrl}`);
            return res.status(400).json({ error: "Un fichier avec ce nom existe déjà." });
        }

        // Créer l'instructeur
        const instructor = await Instructor.create({ name, biography, imageUrl: imagePath });

        res.status(201).json(instructor);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'instructeur" });
    }
};

export const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findOne({
            where: { id },
        });

        if (!instructor) {
            return res.status(404).json({ message: "Instructeur non trouvé" });
        }

        res.status(200).json(instructor);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'instructeur :", error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'instructeur" });
    }
};

export const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, biography } = req.body;

        // Vérifier les champs obligatoires
        if (!name || !biography) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/instructors/${req.file.filename}`);
            }
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/instructors/${req.file.filename}`);
            }
            return res.status(404).json({ error: "Instructeur non trouvé" });
        }

        let imagePath = instructor.imageUrl;
        if (req.file) {
            imagePath = `/uploads/instructors/${req.file.filename}`;
            // Supprime l'ancienne image si elle existe
            if (instructor.imageUrl && fs.existsSync(`public${instructor.imageUrl}`)) {
                fs.unlinkSync(`public/uploads/instructors/${instructor.imageUrl}`);
            }
        }

        await instructor.update(
            {
                name,
                biography,
                imageUrl: imagePath,
            },
            {
                where: { id },
                returning: true,
            }
        );

        res.status(200).json({ message: "Instructeur mis à jour avec succès", result: instructor });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'instructeur" });
    }
};

export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            return res.status(404).json({ message: "Instructeur non trouvé" });
        }

        if (instructor.imageUrl) {
            fs.unlinkSync(`public${instructor.imageUrl}`);
        }

        await instructor.destroy();

        res.status(200).json({ message: "Instructeur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'instructeur" });
    }
};
