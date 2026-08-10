import { callAgent } from "./agent.service.js";
import { sendMessage } from "./meta.service.js";
export const handleWebhook = async (body) => {
    const platform = detectPlatform(body);
    const senderId = GetsenderId(body, platform);
    const message = getMessage(body, platform);

    if (!message) return;

    const reply = await callAgent(
        senderId,
        message
    );

    await sendMessage(
        platform,
        senderId,
        reply
    );
}


function detectPlatform(body) {
    if (
        body.object ===
        "whatsapp_business_account"
    ) {
        return "whatsapp";
    }

    if (
        body.entry?.[0]?.messaging
    ) {
        return "messenger";
    }

    return "instagram";
}

function GetsenderId(body, platform) {
    if (platform === "whatsapp") {
        return body.entry?.[0]
            ?.changes?.[0]
            ?.value?.messages?.[0]
            ?.from;
    }
    if (platform === "messenger") {
        return body.entry?.[0]
            ?.messaging?.[0]
            ?.sender?.id;
    }

    return body.entry?.[0]
        ?.messaging?.[0]
        ?.sender?.id;
}


function getMessage(body, platform) {

    if (platform === "whatsapp") {
        return body.entry?.[0]
            ?.changes?.[0]
            ?.value?.messages?.[0]
            ?.text?.body;
    }

    if (platform === "messenger") {
        return body.entry?.[0]
            ?.messaging?.[0]
            ?.message?.text;
    }

    return body.entry?.[0]
        ?.messaging?.[0]
        ?.message?.text;
}