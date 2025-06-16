import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import { Payment } from "../models/Payment.js";
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
                    model: Masterclass,
                    as: "masterclass", // Si c'est une masterclass
                    required: false, // Masterclass optionnelle
                },
            ],
        });

        // Vérification si c'est un achat de cours ou de masterclass
        const hasPurchasedMasterclass = !!purchase?.masterclass;

        return res.status(200).json({ hasPurchasedMasterclass });
    } catch (error) {
        return res.status(500).json({ error: "Erreur interne" });
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { masterclassId, masterclassName, masterclassPrice, masterclassSlug, masterclassImageUrl } = req.body;

        const userId = req.user.id;

        const purchase = await Purchase.findOne({
            where: {
                userId,
                itemId: masterclassId,
                itemType: "masterclass",
                status: "pending",
            },
        });

        let currentPurchase = purchase;

        if (currentPurchase) {
            if (currentPurchase.amount !== masterclassPrice / 100) {
                currentPurchase.amount = masterclassPrice / 100;
                await currentPurchase.save();
                await Payment.update({ amount: masterclassPrice / 100 }, { where: { purchaseId: currentPurchase.id } });
            }
        } else {
            currentPurchase = await Purchase.create({
                userId,
                itemId: masterclassId,
                itemType: "masterclass",
                status: "pending",
                amount: masterclassPrice / 100,
                title: masterclassName,
            });

            await Payment.create({
                purchaseId: currentPurchase.id,
                emailSent: false,
                paymentMethod: "credit_card",
                transactionId: null,
                amount: masterclassPrice / 100,
                status: "pending",
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: req.user.email,
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: masterclassName,
                            images: ["https://donymusic.fr" + masterclassImageUrl],
                        },
                        unit_amount: masterclassPrice,
                    },
                    quantity: 1,
                    tax_rates: ["txr_1R9loHE9XsDumcXZ3P1DKCbp"],
                },
            ],
            mode: "payment",
            invoice_creation: { enabled: true },
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/masterclass/slug/${masterclassSlug}`,
            metadata: {
                itemId: masterclassId,
                userId,
                type: "masterclass",
            },
        });

        await Payment.update({ transactionId: session.id }, { where: { purchaseId: currentPurchase.id } });

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
            const payment = await Payment.findOne({
                where: { transactionId: sessionId },
                include: [
                    {
                        model: Purchase,
                        as: "purchase",
                        where: {
                            userId,
                            itemType: "masterclass",
                        },
                        include: [
                            {
                                model: Masterclass,
                                as: "masterclass",
                            },
                        ],
                    },
                ],
            });

            if (!payment || !payment.purchase || !payment.purchase.masterclass) {
                return res.status(404).json({ error: "Achat introuvable" });
            }

            const masterclass = payment.purchase.masterclass;

            if (payment.emailSent) {
                return res.json({ success: true, masterclass });
            }

            await sendInvoiceEmail({
                fullname: "Cher client",
                email: session.customer_email,
                subject: `Confirmation de votre achat : ${masterclass.title}`,
                payment,
                productTitle: masterclass.title,
                startDate: new Date(masterclass.startDate).toLocaleDateString("fr-FR"),
                startTime: new Date(masterclass.startDate).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                link: masterclass.link,
            });

            await payment.update({ emailSent: true });

            return res.json({ success: true });
        } else {
            return res.status(400).json({ error: "Le paiement n'a pas été effectué" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erreur lors de la vérification du paiement" });
    }
};

const sendInvoiceEmail = async ({ fullname, email, subject, payment, productTitle, startDate, startTime, link }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = generatePurchaseEmailTemplate({
        fullname,
        payment,
        productTitle,
        startDate,
        startTime,
        link,
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
