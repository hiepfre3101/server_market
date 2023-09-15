import express from 'express';
import { clearToken, refresh, signIn, signUp } from '../controller/auth';
import { responseSender } from '../middleware/configResponse';

const router = express.Router();

router.post('/login', signIn, responseSender);
router.post('/signup', signUp, responseSender);
router.get('/token', refresh);
router.delete('/token', clearToken);

export default router;
