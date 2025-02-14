import generateResetPasswordEmail from "../email/generateResetPasswordEmail.js";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { generatePasswordChangeEmail } from "../email/generatePasswordChangeEmail.js";

export const forgotPassWord = async (req, res) => {
    try {
        const { email } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send("Aucun utilisateur trouvé avec cet e-mail.");
        }

        // Générer un token unique
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Stocker le token et l'expiration dans la base de données
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Générer le contenu de l'e-mail
        const emailContent = `<a href="${resetLink}" style="display: inline-block; color: #2563eb; text-decoration: underline; font-size: 16px;">Réinitialiser votre mot de passe</a>`;

        // Envoi de l'e-mail
        await sendEmail({
            to: user.email,
            subject: "Réinitialisation de mot de passe",
            text: emailContent,
            type: "reset-password",
        });

        res.status(200).send("Un lien de réinitialisation vous sera envoyé.");
    } catch (error) {
        res.status(500).send("Erreur lors de l'envoi de l'e-mail");
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "Token, nouveau mot de passe et confirmation requis." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }

    try {
        const user = await User.findOne({
            where: {
                resetToken: token.trim(),
                resetTokenExpiry: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: "Token invalide ou expiré." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe et supprimer le token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        // Envoyer un e-mail de confirmation
        try {
            await sendEmail({
                to: user.email,
                subject: "Votre mot de passe a été changé",
                type: "password-change",
            });
        } catch (emailError) {
            console.error("Erreur lors de l'envoi de l'e-mail : ", emailError.message);
        }

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Une erreur s'est produite." });
    }
};

const sendEmail = async ({ to, subject, text, type }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: "Donymusic <donymusic@contact.com>",
        to,
        subject,
        text,
        html: type === "reset-password" ? generateResetPasswordEmail({ text }) : generatePasswordChangeEmail(),
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("L'email n'a pas pu être envoyé : " + error.message);
    }
};
