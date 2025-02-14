import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import "./Course.js";
import { Video } from "./Video.js";

export const Chapter = sequelize.define(
    "chapter",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "course",
                key: "id",
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        indexes: [
            {
                fields: ["courseId"],
            },
        ],
        timestamps: true,
        tableName: "chapter",
    }
);

// Définition de la relation avec Video
Chapter.hasMany(Video, {
    foreignKey: "chapterId",
    onDelete: "CASCADE",
});

Video.belongsTo(Chapter, {
    foreignKey: "chapterId",
});
