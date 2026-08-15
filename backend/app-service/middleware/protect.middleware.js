import { redis } from "../config/redis.js";

export const protect =
  async (
    req,
    res,
    next
  ) => {

    const sessionId =
      req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session =
      await redis.get(
        `session:${sessionId}`
      );

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    req.user =
      JSON.parse(session);

    next();
  };