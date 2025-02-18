import slugify from "slugify";
import { Masterclass } from "../models/Masterclass.js";
import { Instructor } from "../models/Instructor.js";
import { putObject } from "../util/putObject.js";
import { deleteObject } from "../util/deleteObject.js";

export const getMasterclasses = async (req, res) => {
    try {
        const masterclasses = await Masterclass.findAll({
            include: [
                {
                    model: Instructor,
                    as: "instructor",
                    attributes: ["id", "name", "imageUrl", "biography"],
                },
            ],
        });
        res.status(200).json(masterclasses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des masterclasses" });
    }
};

export const createMasterclass = async (req, res) => {
    try {
        const { title, slug, description, startDate, endDate, price, duration, maxParticipants, instructorId, link, file } = req.body;

        // Vérifier les champs obligatoires
        if ((!title || !description || !startDate || !endDate || !price || !duration || !maxParticipants || !instructorId, !link)) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier que les dates sont dans le bon ordre
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin" });
        }

        // Vérifier que le prix est valide
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return res.status(400).json({ message: "Le prix doit être un nombre valide et supérieur à 0" });
        }

        // Vérifiez que la catégorie existe
        const instructorExists = await Instructor.findByPk(instructorId);
        if (!instructorExists) {
            return res.status(400).json({ error: "L'instructeur spécifié n'existe pas." });
        }

        const existingMasterclass = await Masterclass.findOne({ where: { title } });
        if (existingMasterclass) {
            return res.status(400).json({ error: "Un cours avec ce nom existe déjà." });
        }

        // Upload de l'image sur S3
        const fileBuffer = Buffer.from(file, "base64");
        const fileName = `masterclass/${Date.now()}-${slug}.jpg`;
        const uploadResult = await putObject(fileBuffer, fileName);

        if (!uploadResult) {
            return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
        }

        const masterclass = await Masterclass.create({
            imageUrl: uploadResult.key,
            title,
            description,
            startDate,
            endDate,
            price: parseFloat(price),
            duration: parseInt(duration),
            maxParticipants: parseInt(maxParticipants),
            instructorId: parseInt(instructorId),
            link,
        });

        res.status(201).json(masterclass);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la masterclass" });
    }
};

export const getMasterclassById = async (req, res) => {
    try {
        const { id } = req.params;
        const masterclass = await Masterclass.findOne({
            where: { id },
            include: [
                {
                    model: Instructor,
                    as: "instructor",
                    attributes: ["id", "name", "imageUrl", "biography"],
                },
            ],
        });

        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass introuvable" });
        }

        res.status(200).json(masterclass);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du masterclass" });
    }
};

export const updateMasterclass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, price, duration, maxParticipants, slug, instructorId, link, file } = req.body;

        // Vérification des champs obligatoires
        if (!title || !description || !startDate || !endDate || !price || !duration || !maxParticipants || !instructorId || !link) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifiez que l'instructeur existe
        const instructorExists = await Instructor.findByPk(instructorId);
        if (!instructorExists) {
            return res.status(400).json({ error: "L'instructeur spécifié n'existe pas." });
        }

        const masterclass = await Masterclass.findByPk(id);
        if (!masterclass) {
            return res.status(404).json({ error: "Masterclass non trouvé" });
        }

        // Regénérer le slug si le titre a changé
        let newSlug = slug || masterclass.slug;
        if (title !== masterclass.title) {
            newSlug = slugify(title, {
                lower: true,
                strict: true,
                locale: "fr",
            });
        }

        let imagePath = masterclass.imageUrl;

        // 🔥 Supprimer l'ancienne image si elle existe
        if (imagePath && file) {
            const deleteResult = await deleteObject(imagePath);

            if (deleteResult.status !== 204) {
                return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
            }
        }

        // 📤 Upload de la nouvelle image si présente
        if (file) {
            const fileBuffer = Buffer.from(file, "base64");
            const fileName = `masterclass/${Date.now()}-${id}.jpg`;

            const uploadResult = await putObject(fileBuffer, fileName);

            if (!uploadResult) {
                return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
            }

            imagePath = uploadResult.key;
        }

        // 🔄 Mise à jour du masterclass
        const updatedMasterclass = await masterclass.update({
            title,
            description,
            startDate,
            endDate,
            price: parseFloat(price),
            imageUrl: imagePath,
            duration: parseInt(duration),
            maxParticipants: parseInt(maxParticipants),
            slug: newSlug,
            instructorId: parseInt(instructorId),
            link,
        });

        res.status(200).json({ message: "Masterclass mis à jour avec succès", result: updatedMasterclass });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du masterclass :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du masterclass" });
    }
};

export const getMasterclassBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const masterclass = await Masterclass.findOne({
            where: { slug },
            include: [
                {
                    model: Instructor,
                    as: "instructor",
                    attributes: ["id", "name", "imageUrl", "biography"],
                },
            ],
        });

        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass non trouvé" });
        }

        res.status(200).json(masterclass);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la masterclass" });
    }
};

export const deleteMasterclass = async (req, res) => {
    try {
        const { id } = req.params;
        const masterclass = await Masterclass.findByPk(id);

        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass introuvable" });
        }

        await masterclass.destroy();

        // Supprimez l'ancienne image sur S3
        const deleteResult = await deleteObject(masterclass.imageUrl);

        if (deleteResult.status !== 204) {
            return res.status(500).json({ error: "Erreur lors de la suppression de l'ancienne image." });
        }

        res.status(200).json({ message: "Masterclass supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du masterclass" });
    }
};
