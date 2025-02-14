import { Category } from "../models/Category.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la catégorie" });
    }
};
