import User from '../models/user';
import { signinSchema, singupSchema } from '../schemas/auth';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { typeRequestMw } from '../middleware/configResponse';

dotenv.config();
const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;

export const signUp = async (req, res, next) => {
   try {
      const { error } = singupSchema.validate(req.body, { abortEarly: false });

      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }

      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
         req[RESPONSE_STATUS] = 400;
         req[RESPONSE_MESSAGE] = `Form error: Email already registered`;
         return next();
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
         ...req.body,
         password: hashPassword,
      });
      if (!user) {
         req[RESPONSE_STATUS] = 401;
         req[RESPONSE_MESSAGE] = `Form error: Create a new user failed`;
         return next();
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
      
      req[RESPONSE_OBJ] = {
         accessToken,
         expires: 10 * 60 * 1000,
         data: user,
      };
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
      return next();
   }
};

export const signIn = async (req, res, next) => {
   try {
      const { error } = signinSchema.validate(req.body, { abortEarly: false });

      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         req[RESPONSE_STATUS] = 404;
         req[RESPONSE_MESSAGE] = `Form error: Email not exist`;
         return next();
      }

      if (!user.state) 
      {
         req[RESPONSE_STATUS] = 403;
         req[RESPONSE_MESSAGE] = `Form error: This account is disabled`;
         return next();
      }

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
         req[RESPONSE_STATUS] = 400;
         req[RESPONSE_MESSAGE] = `Form error: Passwords do not match`;
         return next();
      }

      if (!user) {
         req[RESPONSE_STATUS] = 401;
         req[RESPONSE_MESSAGE] = `Form error: Create a new user failed`;
         return next();
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

      req[RESPONSE_OBJ] = {
         accessToken,
         data: user,
      }
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
      return next();
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
