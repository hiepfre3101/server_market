import User from '../models/user';
import { signinSchema, singupSchema } from '../schemas/auth';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signUp = async (req, res, next) => {
   try {
      const { error } = singupSchema.validate(req.body, { abortEarly: false });

      if (error) {
         const errors = error.details.map(({ message }) => message);
         return res.status(401).json({
            message: errors,
         });
      }

      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
         return res.status(202).json({
            message: 'Email already registered',
         });
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
         ...req.body,
         password: hashPassword,
      });
      if (!user) {
         return res.status(401).json({
            message: 'Create a new user failed',
         });
      }

      const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
         expiresIn: '1d',
      });

      const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
         expiresIn: '1m',
      });

      res.cookie('accessToken', accessToken, {
         expires: new Date(Date.now() + 60 * 1000),
         httpOnly: true,
         secure: true,
      });
      res.cookie('refreshToken', refreshToken, {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
         httpOnly: true,
         secure: true,
      });

      user.password = undefined;
      return res.status(200).json({
         accessToken,
         expires: 10 * 60 * 1000,
         data: user,
      });
   } catch (error) {
      return res.status(401).json({ message: error.message });
   }
};

export const signIn = async (req, res) => {
   try {
      const { error } = signinSchema.validate(req.body, { abortEarly: false });

      if (error) {
         const errors = error.details.map(({ message }) => message);
         return res.status(401).json({
            message: errors,
         });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         return res.status(202).json({
            message: 'Email not exist',
         });
      }

      if (!user.state) {
         return res.status(403).json({
            message: 'This account is disabled',
         });
      }

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
         return res.status(202).json({
            message: 'Passwords do not match',
         });
      }

      if (!user) {
         return res.status(401).json({
            message: 'Create a new user failed',
         });
      }
      const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
         expiresIn: '1d',
      });

      const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
         expiresIn: '1d',
      });
      res.cookie('accessToken', accessToken, {
         expires: new Date(Date.now() + 60 * 1000),
         httpOnly: true,
         secure: true,
      });
      res.cookie('refreshToken', refreshToken, {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
         httpOnly: true,
         secure: true,
      });

      user.password = undefined;

      return res.status(200).json({
         accessToken,
         data: user,
      });
   } catch (error) {
      return res.status(401).json({ message: error.message });
   }
};

export const refresh = async (req, res) => {
   try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
         return res.json({
            token: '',
         });
      }
      jwt.verify(refreshToken, process.env.SERECT_REFRESHTOKEN_KEY, (err, decode) => {
         if (err) {
            return res.status(406).json({
               err,
               token: '',
            });
         } else {
            const accessToken = jwt.sign({ id: decode.id }, process.env.SERECT_ACCESSTOKEN_KEY, {
               expiresIn: '1m',
            });
            return res.status(200).json({
               token: accessToken,
               expires: 60 * 1000,
            });
         }
      });
   } catch (error) {
      return res.status(400).json({ message: error.message });
   }
};

export const clearToken = async (req, res) => {
   try {
      const token = req.cookies.refreshToken;
      if (!token) {
         return res.json({
            message: 'no token available',
         });
      }

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      return res.json({
         message: 'token have been removed',
      });
   } catch (error) {
      return res.status(401).json({ message: error.message });
   }
};
