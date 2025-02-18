import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";
import "../config/dotenv.js";

export const putObject = async (file, fileName) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: file,
            ContentType: "image/jpeg,png,jpg",
        };
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        if (data.$metadata.httpStatusCode !== 200) {
            return;
        }

        // const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        return { key: params.Key };
    } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
        return error;
    }
};
