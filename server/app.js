import express from "express";
import cors from "cors";
import sequelize from "./config/dbMysql.js";
import "./config/dotenv.js";
import courseRoutes from "./routes/courseRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import remiseRoutes from "./routes/remiseRoutes.js";
import userProgressRoutes from "./routes/userProgressRoutes.js";
import masterclassRoutes from "./routes/masterclassRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import crypto from "crypto";
import categoryRoutes from "./routes/categoryRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import Stripe from "stripe";
import { Payment } from "./models/Payment.js";
import { Purchase } from "./models/Purchase.js";
import { sendEmail, sendEventEmail } from "./controllers/email.js";
import remarkRoutes from "./routes/remarkRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import replayRoutes from "./routes/replayRoutes.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import attachmentRoutes from "./routes/attachmentRoutes.js";
import nodemailer from "nodemailer";
import generateInvoiceEmailTemplate from "./email/generateInvoiceEmailTemplate.js";
import { putObjectStripe } from "./util/putObjectStripe.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

app.get("/api/download/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const s3Url = `https://${process.env.NODE_AWS_S3_BUCKET}.s3.${process.env.NODE_AWS_REGION}.amazonaws.com/invoices/${fileName}`;

    res.redirect(s3Url);
});

// 🔹 Webhook avec express.raw() pour Stripe
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🔹 Filtrer uniquement les événements importants
    const relevantEvents = ["checkout.session.completed"];

    if (!relevantEvents.includes(event.type)) {
        return res.status(200).json({ received: true });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            const payment = await Payment.findOne({ where: { transactionId: session.id } });

            if (payment) {
                await payment.update({ status: "completed" });

                const purchase = await Purchase.findOne({ where: { id: payment.purchaseId } });

                if (purchase) {
                    await purchase.update({ status: "completed" });
                }

                // 🔹 Récupérer la facture Stripe
                const invoice = await stripe.invoices.retrieve(session.invoice);
                const invoicePdfUrl = invoice.invoice_pdf;

                if (!invoicePdfUrl) {
                    console.log("⚠️ Facture non disponible.");
                    return res.status(200).json({ message: "Facture en attente de finalisation." });
                }

                // 🔹 Télécharger et uploader la facture sur AWS S3
                const fileName = `invoices/${purchase.itemType}-${Date.now()}.pdf`;
                const s3Url = await putObjectStripe(invoicePdfUrl, fileName);

                if (s3Url) {
                    await payment.update({ invoiceUrl: s3Url });

                    // 🔹 Lien raccourci vers la facture
                    const shortUrl = `${process.env.CLIENT_URL}/download/${fileName}`;

                    // 🔹 Envoyer l’email avec le lien raccourci
                    await sendInvoiceEmail({
                        email: session.customer_email,
                        fullname: "Cher client",
                        invoiceUrl: shortUrl,
                    });
                }
            }

            res.json({ received: true });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors du traitement du paiement" });
        }
    }
});

const sendInvoiceEmail = async ({ email, fullname, invoiceUrl }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = generateInvoiceEmailTemplate({ fullname, invoiceUrl });

    const mailOptions = {
        from: "Donymusic <donymusic@contact.com>",
        to: email,
        subject: "Votre facture d'achat",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé avec succès à :", email);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error);
        throw new Error("L'email n'a pas pu être envoyé");
    }
};

// 🔹 Charger express.json() après pour le reste de l'API
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: "https://donymusic.fr",
        credentials: true,
    })
);

// Synchroniser les modèles avec la base de données
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Les tables ont été créées !");
    })
    .catch((error) => {
        console.error("Erreur lors de la création des tables :", error);
    });

app.use("/api/user", userRoutes);

app.use("/api/remise", remiseRoutes);

app.use("/api/course", courseRoutes);

app.use("/api/chapter", chapterRoutes);

app.use("/api/user-progress", userProgressRoutes);

app.use("/api/masterclass", masterclassRoutes);

app.use("/api/course-player/course/:courseId/chapters/:chapterId", courseRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/instructor", instructorRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/remark", remarkRoutes);

app.use("/api/reply", replyRoutes);

app.use("/api/note", noteRoutes);

app.use("/api/replay", replayRoutes);

app.use("/api/attachment", attachmentRoutes);

app.use("/api/reset-password", resetPasswordRoutes);

app.use("/api/email", (req, res) => {
    sendEmail(req.query)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.use("/api/event", (req, res) => {
    sendEventEmail(req.query)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

export default app;
