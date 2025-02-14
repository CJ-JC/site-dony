import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Course } from "./Course.js";
import { Reply } from "./Reply.js";
import { User } from "./User.js";
import { Video } from "./Video.js";

export const Remark = sequelize.define(
    "remark",
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
    },
    {
        timestamps: true,
        tableName: "remark",
    }
);

// Définition des relations
Remark.belongsTo(Course, {
    foreignKey: "courseId",
    as: "relatedCourse",
    onDelete: "CASCADE",
});

Remark.belongsTo(User, {
    foreignKey: "userId",
    as: "author",
    onDelete: "CASCADE",
});

Remark.belongsTo(Video, {
    foreignKey: "videoId",
    as: "relatedVideo",
    onDelete: "CASCADE",
});

// Remark.hasMany(Reply, { foreignKey: "remarkId", as: "replies" });
Remark.hasMany(Reply, { as: "replies", foreignKey: "remarkId" });
