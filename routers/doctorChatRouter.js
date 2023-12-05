import express from 'express'
import { createChat, doctorChats, findChat } from '../controllers/chatController.js';
const router = express.Router()

router.post('/', createChat);
router.get('/:doctorId', doctorChats);
router.get('/find/:userId/:doctorId', findChat);

export default router