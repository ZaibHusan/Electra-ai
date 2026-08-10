import dotenv from "dotenv";

dotenv.config();


export const META_CONFIG = {
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,

    PAGE_ACCESS_TOKEN:
        process.env.PAGE_ACCESS_TOKEN,

    WHATSAPP_ACCESS_TOKEN:
        process.env.WHATSAPP_ACCESS_TOKEN,

    PHONE_NUMBER_ID:
        process.env.PHONE_NUMBER_ID
};