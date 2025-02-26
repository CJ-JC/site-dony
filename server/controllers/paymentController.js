import Stripe from "stripe";
import { Course } from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import { Payment } from "../models/Payment.js";
import { Category } from "../models/Category.js";
import dotenv from "dotenv";
import { Masterclass } from "../models/Masterclass.js";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import generatePurchaseEmailTemplate from "../email/generatePurchaseEmailTemplate.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                {
                    model: Course,
                    as: "course",
                    required: false,
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: ["id", "title"],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: "payments",
                    attributes: ["invoiceUrl"],
                },
                {
                    model: User,
                    as: "user",
                    required: false,
                },
                {
                    model: Masterclass,
                    as: "masterclass",
                    required: false,
                },
            ],
        });

        res.status(200).json(purchases);
    } catch (error) {
        console.error("Erreur lors de la récupération des achats :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des achats" });
    }
};

export const getUserPurchases = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non connecté" });
        }

        // Récupérer les achats de l'utilisateur connecté
        const purchases = await Purchase.findAll({
            where: { userId },
            include: [
                {
                    model: Payment,
                    as: "payments",
                    attributes: ["invoiceUrl"],
                },
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title", "description", "imageUrl"],
                },
                {
                    model: Masterclass,
                    as: "masterclass",
                    attributes: ["id", "title", "description", "imageUrl"],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
        });

        res.status(200).json({ purchases });
    } catch (error) {
        console.log("Erreur lors de la récupération des achats :", error);

        res.status(500).json({ message: "Erreur serveur lors de la récupération des achats." });
    }
};

export const checkUserPurchase = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.query;

        const purchase = await Purchase.findOne({
            where: {
                userId,
                itemId: id,
                status: "completed",
            },
            include: [
                {
                    model: Course,
                    as: "course", // Si c'est un cours
                    required: false, // Cours optionnel, pour ne pas exiger la présence d'un cours
                },
                {
                    model: Masterclass,
                    as: "masterclass", // Si c'est une masterclass
                    required: false, // Masterclass optionnelle
                },
            ],
        });

        // Vérification si c'est un achat de cours ou de masterclass
        const hasPurchasedCourse = !!purchase?.course;
        const hasPurchasedMasterclass = !!purchase?.masterclass;

        return res.status(200).json({ hasPurchasedCourse, hasPurchasedMasterclass });
    } catch (error) {
        return res.status(500).json({ error: "Erreur interne" });
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { courseId, courseName, coursePrice, courseSlug, courseImageUrl, masterclassId, masterclassName, masterclassPrice, masterclassSlug, masterclassImageUrl } = req.body;

        const userId = req.user.id;

        // Déterminer si l'utilisateur achète un cours ou une masterclass
        const isMasterclass = !!masterclassId;

        const productName = isMasterclass ? masterclassName : courseName;
        const productPrice = isMasterclass ? masterclassPrice : coursePrice;
        const productSlug = isMasterclass ? masterclassSlug : courseSlug;
        const productImageUrl = isMasterclass ? masterclassImageUrl : courseImageUrl;
        const itemId = isMasterclass ? masterclassId : courseId;

        // Vérifier s'il existe déjà une ligne "pending" pour cet utilisateur et cet item
        let purchase = await Purchase.findOne({
            where: {
                userId: userId,
                itemId: itemId,
                itemType: isMasterclass ? "masterclass" : "course",
                status: "pending",
            },
        });

        if (purchase) {
            // Si une remise n'est plus applicable, mettre à jour le prix dans la ligne "pending"
            if (purchase.amount !== productPrice / 100) {
                purchase.amount = productPrice / 100;
                await purchase.save();

                // Mettre à jour le prix dans la table Payment associée
                await Payment.update({ amount: productPrice / 100 }, { where: { purchaseId: purchase.id } });
            }
        } else {
            // Créer un nouvel enregistrement d'achat en attente
            purchase = await Purchase.create({
                userId: userId,
                itemId: itemId,
                itemType: isMasterclass ? "masterclass" : "course",
                status: "pending",
                amount: productPrice / 100,
                title: productName,
            });

            // Créer un enregistrement de paiement en attente
            await Payment.create({
                purchaseId: purchase.id,
                emailSent: false,
                paymentMethod: "credit_card",
                transactionId: null, // La transaction sera liée lors du paiement réussi
                amount: productPrice / 100,
                status: "pending",
            });
        }

        // Créer une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: productName,
                            images: ["https://donymusic.fr" + productImageUrl],
                        },
                        unit_amount: productPrice,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            invoice_creation: { enabled: true },
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${isMasterclass ? `${process.env.CLIENT_URL}/masterclass/slug/${productSlug}` : `${process.env.CLIENT_URL}/detail/slug/${productSlug}`}`,
            metadata: {
                itemId: itemId,
                userId: userId,
                type: isMasterclass ? "masterclass" : "course",
            },
        });

        // Mettre à jour la transactionId pour l'achat
        await Payment.update({ transactionId: session.id }, { where: { purchaseId: purchase.id } });

        res.json({
            id: session.id,
            url: session.url,
        });
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la création de la session de paiement",
            details: error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId } = req.query;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const modelAlias = session.metadata.type === "masterclass" ? "masterclass" : "course";

            const payment = await Payment.findOne({
                where: { transactionId: sessionId },
                include: [
                    {
                        model: Purchase,
                        as: "purchase",
                        where: { userId },
                        include: [
                            {
                                model: session.metadata.type === "masterclass" ? Masterclass : Course,
                                as: modelAlias,
                            },
                        ],
                    },
                ],
            });

            if (payment && payment.purchase) {
                const item = modelAlias === "masterclass" ? payment.purchase.masterclass : payment.purchase.course;

                // Vérifier si l'email a déjà été envoyé (ex : ajouter une colonne "emailSent" dans Payment)
                if (payment.emailSent) {
                    return res.json({ success: true, item });
                }

                // Envoi de l'email une seule fois
                const userEmail = session.customer_email || "cherley95@hotmail.fr";
                const fullname = "Cher client";
                const subject = `Confirmation de votre achat : ${item.title}`;
                const product = `${modelAlias === "masterclass" ? "masterclass" : "formation"}`;
                const productTitle = `"${item.title}"`;

                // Formatage des dates et heures
                const startDate = new Date(item.startDate).toLocaleDateString("fr-FR");
                const startTime = new Date(item.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

                await sendInvoiceEmail({
                    fullname,
                    email: userEmail,
                    subject,
                    payment,
                    item,
                    product,
                    productTitle,
                    startDate,
                    startTime,
                    link: item.link,
                });

                // Mettre à jour la base de données pour indiquer que l'email a été envoyé
                await payment.update({ emailSent: true });

                res.json({ success: true, item });
            } else {
                res.status(404).json({ error: "Paiement non trouvé" });
            }
        } else {
            res.status(400).json({ error: "Le paiement n'a pas été effectué" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la vérification du paiement" });
    }
};

const sendInvoiceEmail = async ({ fullname, email, subject, payment, item, product, productTitle, startDate, startTime, link }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = generatePurchaseEmailTemplate({
        fullname,
        subject,
        email,
        payment,
        item,
        product,
        productTitle,
        startDate,
        startTime,
        link,
    });

    const mailOptions = {
        from: "Donymusic <donymusic@contact.com>",
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
