import crypto from "crypto";
import { redis } from "../config/redis.js";
import { loginService } from "../services/auth.service.js";
import delay from "../utils/delay.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await loginService(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const sessionId = crypto.randomBytes(32).toString("hex");

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({ 
                email,
                userId: user._id,
                name: user.name,
                role: user.role 
            }),
            { EX: 60 * 60 }
        );

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
        });

        // ✅ Return user data here
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
};
export const getUser = async (req, res) => {
    await delay(1);
    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user: req.user,
    });
};

export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            await redis.del(`session:${sessionId}`);
        }

        res.clearCookie("sessionId");

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging out",
        });
    }
};