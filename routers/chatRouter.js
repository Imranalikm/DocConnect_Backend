import express from 'express'
import { createChat, findChat, userChats } from '../controllers/chatController.js';
const router = express.Router()

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:userId/:doctorId', findChat);

export default router