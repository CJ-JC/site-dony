import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
import { Remark } from "./Remark.js";

export const Reply = sequelize.define(
    "reply",
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
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        remarkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "remark",
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
        tableName: "reply",
    }
);

Reply.belongsTo(User, { as: "author", foreignKey: "userId" });
