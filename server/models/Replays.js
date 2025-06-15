import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Masterclass } from "./Masterclass.js";

export const Replays = sequelize.define(
    "replays",
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
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recordedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        masterclassId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Masterclass,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        timestamps: true,
        tableName: "replays",
    }
);

// Relation
Replays.belongsTo(Masterclass, { foreignKey: "masterclassId", as: "masterclass" });
Masterclass.hasMany(Replays, { foreignKey: "masterclassId", as: "replays" });
