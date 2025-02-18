import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";
import "../config/dotenv.js";

export const deleteObject = async (key) => {
    try {
        if (!key) {
            throw new Error("Le Key de l'image est vide ou non défini.");
        }

        const params = {
            Bucket: process.env.NODE_AWS_S3_BUCKET,
            Key: key,
        };

        const command = new DeleteObjectCommand(params);
        const data = await s3Client.send(command);

        if (data.$metadata.httpStatusCode !== 204) {
            return { status: 400, data, message: "Erreur lors de la suppression de l'image" };
        }
        return { status: 204 };
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error);
        return error;
    }
};
