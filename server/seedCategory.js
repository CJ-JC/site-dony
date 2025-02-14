import sequelize from "./config/dbMysql.js";
import { Category } from "./models/Category.js";

const seedCategory = async () => {
    try {
        await sequelize.sync();

        await Category.create({
            title: "Basse",
        });

        await Category.create({
            title: "Batterie",
        });

        await Category.create({
            title: "Guitare",
        });

        await Category.create({
            title: "Piano",
        });
    } catch (error) {
        console.error("Erreur lors de la création des Remises :", error);
    }
};

seedCategory();
