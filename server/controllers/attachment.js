import { Attachments } from "../models/Attachments.js";
import fs from "fs";

export const deleteAttachment = async (req, res) => {
    try {
        const { id } = req.params;

        const attachment = await Attachments.findByPk(id);
        if (!attachment) {
            return res.status(404).json({ error: "Annexe non trouvée" });
        }

        // Supprimer le fichier physique
        try {
            fs.unlinkSync(`public${attachment.fileUrl}`);
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier:", error);
        }

        // Supprimer l'enregistrement en base de données
        await attachment.destroy();

        res.status(200).json({ message: "Annexe supprimée avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression de l'annexe: ${error.message}`,
        });
    }
};
