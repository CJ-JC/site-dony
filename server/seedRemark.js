import sequelize from "./config/dbMysql.js";
import { Remark } from "./models/Remark.js";

const seedRemark = async () => {
    try {
        await sequelize.sync();

        await Remark.create({
            content: "J'ai une question",
        });
    } catch (error) {
        console.error("Erreur lors de la création des Remises :", error);
    }
};

seedRemark();
