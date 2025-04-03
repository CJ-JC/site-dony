import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";
import mime from "mime-types";
import "../config/dotenv.js";

export const putObjectStripe = async (fileUrl, fileName) => {
    try {
        // 🔹 Télécharger le PDF Stripe
        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer", // Permet d'obtenir un Buffer
        });

        const fileBuffer = Buffer.from(response.data); // Convertir les données en Buffer
        const contentType = mime.lookup(fileName) || "application/pdf"; // Détecter le type MIME

        // 🔹 Paramètres de l'upload AWS S3
        const params = {
            Bucket: process.env.NODE_AWS_S3_BUCKET,
            Key: fileName,
            Body: fileBuffer, // Envoyer le Buffer et non l'URL
            ContentType: contentType,
            ACL: "public-read",
        };

        try {
            const command = new PutObjectCommand(params);
            await s3Client.send(command);
        } catch (error) {
            throw new Error("Échec de l'upload du fichier sur AWS S3");
        }

        // 🔹 Générer l'URL du fichier stocké sur S3
        return `https://${process.env.NODE_AWS_S3_BUCKET}.s3.${process.env.NODE_AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new Error("Échec de l'upload du fichier sur AWS S3");
    }
};
