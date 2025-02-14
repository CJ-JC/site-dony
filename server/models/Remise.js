import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Course } from "./Course.js";

export const Remise = sequelize.define(
    "remise",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        discountPercentage: {
            type: DataTypes.FLOAT,
            allowNull: false, // Pourcentage de réduction
        },
        isGlobal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Indique si le coupon s'applique à tous les cours
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: true, // Date limite d'utilisation du coupon
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Null si le coupon est global
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
        tableName: "remise",
    }
);

// Relation entre Remise et Course (une remise peut être appliqué à un cours spécifique)
Remise.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
});
Course.hasMany(Remise, {
    foreignKey: "courseId",
    as: "coupons",
});
