import nodemailer from "nodemailer";
import generateContactEmailTemplate from "../email/generateContactEmailTemplate.js";
import generateEventEmailTemplate from "../email/generateEventEmailTemplate.js";

function sendEmail({ email, fullname, subject, message }) {
    return new Promise((resolve, reject) => {
        // Regex pour valider l'email
        const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const trimEmail = email.trim().toLowerCase().replace(/\s+/g, "");
        const isValidEmail = emailRegexp.test(trimEmail);

        // Vérification des champs obligatoires
        if (!email || !fullname || !subject || !message) {
            return reject({
                message: "Tous les champs sont obligatoires.",
            });
        }

        // Vérification de la validité de l'email
        if (!isValidEmail) {
            return reject({
                message: "L'email est invalide",
            });
        }

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587", 10),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Générer le contenu HTML du mail
        const emailHTML = generateContactEmailTemplate({
            fullname,
            subject,
            email,
            message,
        });

        const mail_configs = {
            from: email,
            to: process.env.EMAIL_FROM,
            replyTo: email,
            subject: subject,
            text: message,
            html: emailHTML,
        };

        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.error("❌ Erreur lors de l'envoi de l'email :", error);
                return reject({ message: "Erreur lors de l'envoi de l'email" });
            }
            return resolve({ message: "Votre message a été envoyé avec succès" });
        });
    });
}

function sendEventEmail({ email, firstName, lastName, eventType, message }) {
    return new Promise((resolve, reject) => {
        // Regex pour valider l'email
        const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const trimEmail = email.trim().toLowerCase().replace(/\s+/g, "");
        const isValidEmail = emailRegexp.test(trimEmail);

        // Vérification des champs obligatoires
        if (!email || !firstName || !lastName || !eventType || !message) {
            return reject({
                message: "Tous les champs sont obligatoires.",
            });
        }

        // Vérification de la validité de l'email
        if (!isValidEmail) {
            return reject({
                message: "L'email est invalide",
            });
        }

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587", 10),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Générer le contenu HTML du mail
        const emailHTML = generateEventEmailTemplate({
            firstName,
            lastName,
            eventType,
            email,
            message,
        });

        const mail_configs = {
            from: email, // Ton email vérifié
            to: process.env.EMAIL_FROM, // Là où tu veux recevoir les demandes (peut être le même que FROM)
            replyTo: email,
            subject: `Demande de devis pour un événement`,
            text: message,
            html: emailHTML,
        };

        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.error("❌ Erreur lors de l'envoi de l'email :", error);
                return reject({ message: "Erreur lors de l'envoi de l'email" });
            }
            return resolve({ message: "Votre message a été envoyé avec succès" });
        });
    });
}

export { sendEmail, sendEventEmail };
