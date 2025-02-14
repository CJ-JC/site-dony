import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Purchase } from "./Purchase.js";

export const Payment = sequelize.define(
    "payment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        purchaseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Purchase,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        paymentMethod: {
            type: DataTypes.ENUM("credit_card", "paypal", "bank_transfer"),
            allowNull: false,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "failed"),
            defaultValue: "pending",
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
        tableName: "payment",
    }
);

// Relations
Purchase.hasMany(Payment, { foreignKey: "purchaseId", as: "payments" });
Payment.belongsTo(Purchase, { foreignKey: "purchaseId", as: "purchase" });
