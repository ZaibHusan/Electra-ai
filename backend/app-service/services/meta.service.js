import { META_CONFIG } from "../config/meta.config.js";

export const sendMessage = async (
    platform,
    recipientId,
    message
) => {

    try {

        if (message == null) return;
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

                // message: {
                //     attachment: {
                //         type: "audio",
                //         payload: { url: "https://cdn.fbsbx.com/v/t59.3654-21/768603808_2880898775621640_5280349849276806550_n.mp4/audioclip-1786487560000-10379.mp4?sdl=1&_nc_cat=105&ccb=1-7&_nc_sid=d61c36&_nc_ohc=jwFkf96IWLUQ7kNvwH0r7pS&_nc_oc=AdpfWlp4ki-S1TG-CQxD6XtXk2tqm7hLmxITOANz1357Sxtrd3XX9ByD7qreAfnYutaIuu-q1u0NjdK0NtiaVZPL&_nc_ad=z-m&_nc_cid=0&_nc_zt=28&_nc_ht=cdn.fbsbx.com&_nc_gid=0xDmKAhx-i4cCRemseXg-g&oh=03_Q7cD6AHAINaSGslX_SRg5yyn4iKdUJs7L3y-RHFgQy-eewMgsw&oe=6A817CCB", is_reusable: true }
                //     }
                // }
            })
        }
    );

    const data = await response.json();

    console.log("Messenger Response:");
    console.log(data);
}

async function sendInstagram(recipientId, message) {
    const response = await fetch(
        `https://graph.instagram.com/v23.0/me/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${META_CONFIG.INSTAGRAM_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: message }
            })
        }
    );
    const data = await response.json();
    console.log("Instagram Response:", data);
}