import { META_CONFIG } from "../config/meta.config.js";

export const sendMessage = async (
    platform,
    recipientId,
    message
) => {

    try {

        if(message == null) return;
        switch (platform) {

            case "whatsapp":
                return sendWhatsApp(
                    recipientId,
                    message
                );

            case "messenger":
                return sendMessenger(
                    recipientId,
                    message
                );

            case "instagram":
                return sendInstagram(
                    recipientId,
                    message
                );

            default:
                console.log(
                    "Unknown platform:",
                    platform
                );
        }

        console.log("Message sent successfully.");
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

async function sendWhatsApp(
    recipientId,
    message
) {

    await fetch(
        `https://graph.facebook.com/v23.0/${META_CONFIG.PHONE_NUMBER_ID}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${META_CONFIG.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: recipientId,
                type: "text",
                text: {
                    body: message
                }
            })
        }
    );
}



async function sendMessenger(
    recipientId,
    message
) {

    const response = await fetch(
        `https://graph.facebook.com/v23.0/me/messages?access_token=${META_CONFIG.PAGE_ACCESS_TOKEN}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipient: {
                    id: recipientId
                },
                message: {
                    text: message
                }
            })
        }
    );

    const data = await response.json();

    console.log("Messenger Response:");
    console.log(data);
}

async function sendInstagram(
    recipientId,
    message
) {

    await fetch(
        `https://graph.facebook.com/v23.0/me/messages?access_token=${META_CONFIG.PAGE_ACCESS_TOKEN}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipient: {
                    id: recipientId
                },
                message: {
                    text: message
                }
            })
        }
    );
}