import express from 'express';
import { clearToken, redirect, refresh, signIn, signUp } from '../controller/auth';
import { responseSender } from '../middleware/configResponse';
import passport from 'passport';
const router = express.Router();

router.post('/login', signIn, responseSender);
router.post('/signup', signUp, responseSender);
router.get('/auth/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/error' }), redirect);
router.get('/auth/facebook/login', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/error' }), redirect);
router.get('/token', refresh, responseSender);
router.delete('/token', clearToken, responseSender);

export default router;
