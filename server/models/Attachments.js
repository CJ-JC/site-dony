import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Course } from "./Course.js";
import { Chapter } from "./Chapter.js";
import { Video } from "./Video.js";

export const Attachments = sequelize.define(
    "attachments",
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
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        videoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Video,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Course,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Chapter,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        timestamps: true,
        tableName: "attachments",
    }
);

// Définition des relations
Course.hasMany(Attachments, { foreignKey: "courseId", as: "attachments" });
Attachments.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Chapter.hasMany(Attachments, { foreignKey: "chapterId", as: "attachments" });
Attachments.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

Video.hasMany(Attachments, { foreignKey: "videoId", as: "attachments" });
Attachments.belongsTo(Video, { foreignKey: "videoId", as: "video" });

export default Attachments;
