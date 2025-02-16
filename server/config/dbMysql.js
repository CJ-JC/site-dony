import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import "./dotenv.js";

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    benchmark: true,
});

export default sequelize;
