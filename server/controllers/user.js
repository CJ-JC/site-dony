import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import generateRegisterEmailTemplate from "../email/generateRegisterEmailTemplate.js";
import { Purchase } from "../models/Purchase.js";
import { Masterclass } from "../models/Masterclass.js";
dotenv.config();

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

export const registerUser = async (req, res) => {
    // Nettoyage des champs pour supprimer les espaces superflus
    const firstName = req.body.firstName.trim().replace(/\s+/g, " ");
    const lastName = req.body.lastName.trim().replace(/\s+/g, " ");
    const email = req.body.email.trim().toLowerCase().replace(/\s+/g, "");
    const password = req.body.password.trim();

    // Regex pour valider l'email
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegexp.test(email);

    // Regex pour valider le mot de passe
    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification de la longueur du prénom et du nom
    if (firstName.length < 2 || lastName.length < 2) {
        return res.status(400).json({
            message: "Le prénom et le nom doivent contenir au moins 2 caractères.",
        });
    }

    // Vérification de la validité de l'email
    if (!isValidEmail) {
        return res.status(400).json({ message: "L'email est invalide" });
    }

    // Vérification de la validité du mot de passe
    if (!passwordRegexp.test(password)) {
        return res.status(400).json({
            message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        });
    }

    try {
        // Vérifiez si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé" });
        }

        // Hash du mot de passe avec bcrypt
        const saltRounds = 10; // Niveau de complexité
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Envoi de l'email après paiement confirmé
        const userEmail = email;
        const fullname = firstName;

        // Créez l'utilisateur avec le mot de passe haché
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        try {
            await sendInvoiceEmail({
                fullname,
                email: userEmail,
                subject: "Bienvenue sur Donymusic",
            });
        } catch (emailError) {
            console.error("Erreur d'envoi de l'email :", emailError.message);
        }

        // Masquer le mot de passe dans la réponse
        const { id, createdAt, updatedAt } = user;
        res.status(201).json({ id, firstName, lastName, email, createdAt, updatedAt });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

export const loginUser = async (req, res) => {
    const email = req.body.email.trim().toLowerCase().replace(/\s+/g, "");
    const password = req.body.password.trim();

    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegexp.test(email);

    if (!isValidEmail) {
        return res.status(400).json({ message: "L'email est invalide" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Création du token JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });

        res.status(200).json({
            message: "Connexion réussie",
            token: token,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;

        // les champs sont obligatoires
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Récupérer l'utilisateur à mettre à jour
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Validation de l'email si fourni
        if (email && !emailRegexp.test(email)) {
            return res.status(400).json({ message: "L'email est invalide" });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }
        }

        // Mise à jour des informations de l'utilisateur
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email ? email.toLowerCase() : user.email,
        });

        // Renvoyer l'utilisateur mis à jour sans le mot de passe
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

export const updateUserPassword = async (req, res) => {
    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    try {
        const { id } = req.params;
        const { password, confirmPassword, passwordCurrent } = req.body;

        // les champs sont obligatoires
        if (!password || !confirmPassword || !passwordCurrent) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérification de la modification du mot de passe
        if (password || confirmPassword) {
            if (!passwordCurrent) {
                return res.status(400).json({
                    message: "Le mot de passe actuel est requis pour le modifier.",
                });
            }

            // Vérifier si le mot de passe actuel est correct
            const isPasswordValid = await bcrypt.compare(passwordCurrent, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Le mot de passe actuel est incorrect.",
                });
            }

            // Vérifier si les nouveaux mots de passe correspondent
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Les nouveaux mots de passe ne correspondent pas.",
                });
            }

            // Vérifier la validité du nouveau mot de passe
            if (!passwordRegexp.test(password)) {
                return res.status(400).json({
                    message: "Exigences en matière de mot de passe non respectées.",
                });
            }
        }

        // Hachage du nouveau mot de passe (si renseigné)
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Mise à jour des informations de l'utilisateur
        await user.update({
            ...(hashedPassword && { password: hashedPassword }),
        });

        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Purchase,
                    as: "purchases",
                    where: { status: "completed" }, // facultatif : uniquement les achats réussis
                    required: false, // pour inclure les users même s'ils n'ont aucun achat
                    include: [
                        {
                            model: Masterclass,
                            as: "masterclass",
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Erreur getUserById:", error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};

export const deletePurchaseUser = async (req, res) => {
    const { id } = req.params;

    try {
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            return res.status(404).json({ message: "Achat introuvable" });
        }

        await purchase.destroy();
        res.status(200).json({ message: "Achat supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'achat" });
    }
};

const sendInvoiceEmail = async ({ fullname, email, subject }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = generateRegisterEmailTemplate({
        fullname,
    });

    const mailOptions = {
        from: `"Dony Music" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("L'email n'a pas pu être envoyé");
    }
};
