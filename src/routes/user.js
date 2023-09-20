import express from 'express';
import { getAllUsers, getOneUser, createUser, updateUser, removeUser } from '../controller/user';
import { responseSender } from '../middleware/configResponse';
import passport from 'passport';
const router = express.Router();

router.get('/users', getAllUsers, responseSender);
router.get('/users/:id', getOneUser, responseSender);
router.post('/users', createUser, responseSender);
router.patch('/users/:id', updateUser, responseSender);
router.delete('/users/:id', removeUser, responseSender);

export default router;
