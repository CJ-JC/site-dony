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
import session from "express-session";
import crypto from "crypto";
import categoryRoutes from "./routes/categoryRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import Stripe from "stripe";
import { Payment } from "./models/Payment.js";
import { Purchase } from "./models/Purchase.js";
import { sendEmail } from "./controllers/email.js";
import remarkRoutes from "./routes/remarkRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import attachmentRoutes from "./routes/attachmentRoutes.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(
    cors({
        origin: "https://donymusic.fr",
        credentials: true,
    })
);

app.post("/api/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            // Mettre à jour le paiement
            const payment = await Payment.findOne({
                where: { transactionId: session.id },
            });

            if (payment) {
                await payment.update({
                    status: "completed",
                });

                // Mettre à jour l'achat
                const purchase = await Purchase.findOne({
                    where: { id: payment.purchaseId },
                });

                if (purchase) {
                    await purchase.update({
                        status: "completed",
                    });
                }
            }

            res.json({ received: true });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors du traitement du paiement" });
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "none",
        },
    })
);

app.set("trust proxy", 1);

// Synchroniser les modèles avec la base de données
sequelize
    .sync()
    .then(() => {
        console.log("Les tables ont été créées !");
    })
    .catch((error) => {
        console.error("Erreur lors de la création des tables :", error);
    });

app.use("/uploads", express.static("public/uploads"));

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

app.use("/api/attachment", attachmentRoutes);

app.use("/api/reset-password", resetPasswordRoutes);

app.use("/api/email", (req, res) => {
    sendEmail(req.query)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

export default app;
