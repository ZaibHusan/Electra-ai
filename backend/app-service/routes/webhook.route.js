import express from "express";
import { receiveWebhook, verifyWebhook } from "../controllers/webhook.controller.js";


const webhookRoute = express.Router();

webhookRoute.get('/', verifyWebhook)
webhookRoute.post('/', receiveWebhook)


export default webhookRoute;