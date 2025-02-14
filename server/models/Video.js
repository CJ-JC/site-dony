import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";

export const Video = sequelize.define(
    "video",
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
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "chapter",
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
        timestamps: true,
        tableName: "video",
    }
);

// // Relation avec Chapter
// Chapter.hasMany(Video, {
//     foreignKey: "chapterId",
//     onDelete: "CASCADE",
// });

// Video.belongsTo(Chapter, {
//     foreignKey: "chapterId",
// });
