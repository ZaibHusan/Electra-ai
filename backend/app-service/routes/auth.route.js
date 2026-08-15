import express from "express";
import { getUser, login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.middleware.js";


const authRoute = express.Router();

authRoute.get("/", (req, res) => {
    res.send("Auth Service is running!");
});

authRoute.post("/login", login);
authRoute.get('/user', protect, getUser);
authRoute.post('/logout', protect, logout);

export default authRoute;