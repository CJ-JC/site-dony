import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
import { Course } from "./Course.js";
import { Masterclass } from "./Masterclass.js";

export const Purchase = sequelize.define(
    "purchase",
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        itemType: {
            type: DataTypes.ENUM("course", "masterclass"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "failed"),
            defaultValue: "pending",
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
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
        tableName: "purchase",
    }
);

// Relations
User.hasMany(Purchase, { foreignKey: "userId", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "userId", as: "user" });

Purchase.belongsTo(Course, {
    foreignKey: "itemId",
    constraints: false,
    as: "course",
});
Purchase.belongsTo(Masterclass, {
    foreignKey: "itemId",
    constraints: false,
    as: "masterclass",
});
