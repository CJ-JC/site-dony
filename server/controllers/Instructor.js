import { Instructor } from "../models/Instructor.js";
import { putObject } from "../util/putObject.js";
import { deleteObject } from "../util/deleteObject.js";

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
        const { name, biography, file } = req.body;

        // Vérification des champs obligatoires
        if (!name || !biography) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier si l'image existe déjà
        const existingImage = await Instructor.findOne({ where: { name } });
        if (existingImage) {
            return res.status(400).json({ error: "Un fichier avec ce nom existe déjà." });
        }

        // Upload de l'image sur S3
        const fileBuffer = Buffer.from(file, "base64");
        const fileName = `instructor/${Date.now()}.jpg`;
        const uploadResult = await putObject(fileBuffer, fileName);

        if (!uploadResult) {
            return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
        }

        // Créer l'instructeur
        const instructor = await Instructor.create({ name, biography, imageUrl: uploadResult.key });

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
        const { name, biography, file } = req.body;

        // Vérifier les champs obligatoires
        if (!name || !biography) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            return res.status(404).json({ error: "Instructeur non trouvé" });
        }

        let imagePath = instructor.imageUrl;

        // 🔥 Supprimer l'ancienne image si elle existe
        if (imagePath) {
            const deleteResult = await deleteObject(imagePath);

            if (deleteResult.status !== 204) {
                return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
            }
        }

        if (file) {
            const fileBuffer = Buffer.from(file, "base64");
            const fileName = `instructor/${Date.now()}-${id}.jpg`;

            const uploadResult = await putObject(fileBuffer, fileName);

            if (!uploadResult) {
                return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
            }

            imagePath = uploadResult.key;
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

        await instructor.destroy();

        // Supprimez l'ancienne image sur S3
        const deleteResult = await deleteObject(instructor.imageUrl);

        if (deleteResult.status !== 204) {
            return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
        }

        res.status(200).json({ message: "Instructeur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'instructeur" });
    }
};
