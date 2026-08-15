import { createClient } from "redis";

export const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redis.on("error", (err) => {
  console.error("🔴 Redis Error:", err);
});

export const connectRedis = async () => {
  await redis.connect();
  console.log("🟢 Redis Connected ");
};