import express from 'express';
import { payWithBkash, bkashCallback } from '../controllers/bkashController.js';
const router = express.Router();

router.post('/pay', payWithBkash);
router.get('/callback', bkashCallback); // Use GET for callback

export default router;
