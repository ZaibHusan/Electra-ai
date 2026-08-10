import { handleWebhook } from "../services/webhook.service.js";


export const verifyWebhook = (req, res) => {
    console.log(req.query);
    try {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (
            mode === "subscribe" &&
            token === process.env.VERIFY_TOKEN
        ) {
            return res.status(200).send(challenge)
        }
        return res.sendStatus(403);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}


export const receiveWebhook = async(req, res) => {
    try {
        console.log(req.body);
        await handleWebhook(req.body)
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}