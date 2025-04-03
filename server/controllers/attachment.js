import { Attachments } from "../models/Attachments.js";
import { deleteObject } from "../util/deleteObject.js";

export const deleteAttachment = async (req, res) => {
    try {
        const { id } = req.params;

        const attachment = await Attachments.findByPk(id);
        if (!attachment) {
            return res.status(404).json({ error: "Annexe non trouvée" });
        }

        try {
            // Supprimer l'ancien fichier S3
            await deleteObject(attachment.fileUrl);
            await attachment.destroy();
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
