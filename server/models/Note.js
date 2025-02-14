import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Course } from "./Course.js";
import { User } from "./User.js";
import { Video } from "./Video.js";

export const Note = sequelize.define(
    "note",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        videoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "video",
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "note",
    }
);

// Définition des relations
Note.belongsTo(Course, {
    foreignKey: "courseId",
    as: "relatedCourse",
    onDelete: "CASCADE",
});

Note.belongsTo(User, {
    foreignKey: "userId",
    as: "author",
    onDelete: "CASCADE",
});

Note.belongsTo(Video, {
    foreignKey: "videoId",
    as: "relatedVideo",
    onDelete: "CASCADE",
});
