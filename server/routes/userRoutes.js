import express from "express";
import { getUsers, loginUser, updateUser, getUserProfile, registerUser, updateUserPassword } from "../controllers/user.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/profile/:id", getUserProfile);

router.put("/:id", updateUser);

router.put("/:id/password", updateUserPassword);

router.post("/signin", loginUser);

router.post("/signup", registerUser);

router.get("/check-auth", checkAuth);

router.get("/protected-route", checkAuth, (req, res) => {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
});

export default router;
