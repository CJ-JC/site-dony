import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";
import "../config/dotenv.js";

export const getObject = async (fileUrl) => {
    try {
        const key = fileUrl.split(".com/")[1];

        const params = {
            Bucket: process.env.NODE_AWS_S3_BUCKET,
            Key: key,
        };

        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'image :", error);
    }
};
