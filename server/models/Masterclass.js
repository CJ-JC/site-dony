import sequelize from "../config/dbMysql.js";
import { DataTypes } from "sequelize";
import slugify from "slugify";
import { Instructor } from "./Instructor.js";

export const Masterclass = sequelize.define(
    "masterclass",
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
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "instructor",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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
        tableName: "masterclass",
        hooks: {
            beforeValidate: (masterclass) => {
                if (masterclass.title) {
                    // Générer le slug à partir du titre
                    let baseSlug = slugify(masterclass.title, {
                        lower: true, // Convertir en minuscules
                        strict: true, // Remplacer les caractères spéciaux
                        locale: "fr", // Utiliser les règles françaises
                    });

                    // Ajouter un timestamp pour garantir l'unicité
                    masterclass.slug = `${baseSlug}-${Date.now()}`;
                }
            },
        },
    }
);

// Relation One-to-Many: Un Instructor peut avoir plusieurs Masterclasses
Instructor.hasMany(Masterclass, {
    foreignKey: "instructorId", // Clé étrangère dans Masterclass
    as: "masterclasses", // Alias pour accéder aux masterclasses d'un instructeur
});

// Relation Many-to-One: Une Masterclass appartient à un seul Instructor
Masterclass.belongsTo(Instructor, {
    foreignKey: "instructorId", // Clé étrangère dans Masterclass
    as: "instructor", // Alias pour accéder à l'instructeur d'une masterclass
});
