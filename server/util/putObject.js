import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";
import mime from "mime-types";
import "../config/dotenv.js";

export const putObject = async (file, fileName) => {
    try {
        const contentType = mime.lookup(fileName) || "application/octet-stream";

        const params = {
            Bucket: process.env.NODE_AWS_S3_BUCKET,
            Key: fileName,
            Body: file,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        if (data.$metadata.httpStatusCode !== 200) {
            throw new Error("Upload échoué");
        }

        return { key: params.Key };
    } catch (error) {
        console.error("Erreur lors de l'upload du fichier :", error);
        return error;
    }
};
