import express from 'express';
import { clearToken, getToken, signIn, signUp } from '../controller/auth';


const router = express.Router()

router.post('/login', signIn)
router.post('/signup', signUp)
router.get('/token', getToken)
router.delete('/token', clearToken)

export default router