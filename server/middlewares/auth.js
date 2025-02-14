import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ isAuthenticated: false, message: "Token non fourni" });
    }

    try {
        const decoded = jwt.verify(token, "secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ isAuthenticated: false, message: "Token invalide" });
    }
};
