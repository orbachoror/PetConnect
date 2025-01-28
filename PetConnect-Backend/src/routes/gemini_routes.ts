import express from 'express';
import { authMiddleware } from '../middleware/auth_middleware';
import { geminiPostAndGetData } from '../controllers/gemini_controller';
const router = express.Router();

router.post('/', geminiPostAndGetData);

export default router;