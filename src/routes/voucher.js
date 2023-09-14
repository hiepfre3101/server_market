import express from 'express';

import { responseSender } from '../middleware/configResponse';
import { createVoucher, getAllVoucher, getOneVoucher, updateVoucher } from '../controller/voucher';
const router = express.Router();
router.post('/voucher', createVoucher, responseSender);
router.get('/voucher', getAllVoucher, responseSender);
router.get('/voucher/:id', getOneVoucher, responseSender);
router.patch('/voucher/:id', updateVoucher, responseSender);
export default router;