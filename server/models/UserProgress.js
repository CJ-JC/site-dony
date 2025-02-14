import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Chapter } from "./Chapter.js";
import { User } from "./User.js";
import { Video } from "./Video.js";

export const UserProgress = sequelize.define(
    "userProgress",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "chapter",
                key: "id",
            },
        },
        isComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        progress: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
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
        timestamps: true,
        tableName: "user_progress",
    }
);

// Relations
UserProgress.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

UserProgress.belongsTo(Chapter, {
    foreignKey: "chapterId",
    onDelete: "CASCADE",
});

User.hasMany(UserProgress, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Chapter.hasMany(UserProgress, {
    foreignKey: "chapterId",
    onDelete: "CASCADE",
});

UserProgress.belongsTo(Video, {
    foreignKey: "videoId",
    onDelete: "CASCADE",
});

Video.hasMany(UserProgress, {
    foreignKey: "videoId",
    onDelete: "CASCADE",
});
