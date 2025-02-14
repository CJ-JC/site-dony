import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

if (!process.env.PORT) {
    throw new Error("PORT is not set in the environment variables");
}

export default configDotenv;
