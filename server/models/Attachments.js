import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";

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
// Course.hasMany(Attachments, { foreignKey: "courseId", as: "attachments" });
// Attachments.belongsTo(Course, { foreignKey: "courseId", as: "course" });

export default Attachments;
