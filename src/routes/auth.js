import express from 'express';
import { clearToken, refresh, signIn, signUp } from '../controller/auth';


const router = express.Router()

router.post('/login', signIn)
router.post('/signup', signUp)
router.get('/token', refresh)
router.delete('/token', clearToken)

export default router