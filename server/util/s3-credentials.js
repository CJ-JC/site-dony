import { S3Client } from "@aws-sdk/client-s3";
import "../config/dotenv.js";

export const s3Client = new S3Client({
    region: process.env.NODE_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NODE_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NODE_AWS_SECRET_KEY,
    },
});
