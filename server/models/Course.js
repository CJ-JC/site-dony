import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import { Chapter } from "./Chapter.js";
import slugify from "slugify";
import { Category } from "./Category.js";

export const Course = sequelize.define(
    "course",
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
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "category",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        tableName: "course",
        hooks: {
            beforeValidate: (course) => {
                if (course.title) {
                    // Générer le slug à partir du titre
                    let baseSlug = slugify(course.title, {
                        lower: true, // Convertir en minuscules
                        strict: true, // Remplacer les caractères spéciaux
                        locale: "fr", // Utiliser les règles françaises
                    });

                    // Ajouter un timestamp pour garantir l'unicité
                    course.slug = `${baseSlug}-${Date.now()}`;
                }
            },
        },
    }
);

// Définition des relations
Course.hasMany(Chapter, {
    foreignKey: "courseId",
    onDelete: "CASCADE",
});

Chapter.belongsTo(Course, {
    foreignKey: "courseId",
});

Category.hasMany(Course, {
    foreignKey: "categoryId",
    as: "courses",
});

Course.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
});
