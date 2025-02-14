import nodemailer from "nodemailer";
import generateContactEmailTemplate from "../email/generateContactEmailTemplate.js";

function sendEmail({ email, fullname, message }) {
    return new Promise((resolve, reject) => {
        // Regex pour valider l'email
        const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const trimEmail = email.trim().toLowerCase().replace(/\s+/g, "");
        const isValidEmail = emailRegexp.test(trimEmail);

        // Vérification des champs obligatoires
        if (!email || !fullname || !message) {
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
            subject: `Nouveau message de ${fullname}`,
            email,
            message,
        });

        const mail_configs = {
            from: email,
            to: process.env.EMAIL_FROM,
            subject: `Nouveau message de ${fullname}`,
            text: message,
            html: emailHTML,
        };

        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                return reject({ message: `An error has occurred` });
            }
            return resolve({ message: "Votre message a été envoyé avec succès" });
        });
    });
}

export { sendEmail };
