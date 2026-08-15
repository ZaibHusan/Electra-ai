import express from 'express';
import { 
    getConversations, 
    getMessages, 
    sendHumanMessage, 
    toggleMode, 
    markAsRead 
} from '../controllers/conversation.controller.js';

const conversationsRoute = express.Router();


conversationsRoute.get('/', (req, res) => {
    res.send("Conversations Service is running!");
});


conversationsRoute.get('/getconversations', getConversations);


conversationsRoute.get('/getmessages/:id', getMessages);


conversationsRoute.post('/:id/messages', sendHumanMessage);


conversationsRoute.patch('/:id/mode', toggleMode);


conversationsRoute.patch('/:id/read', markAsRead);

export default conversationsRoute;