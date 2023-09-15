import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import dotenv from 'dotenv';
import User from '../models/user';
import { validateUser } from '../controller/auth';
import jwt from 'jsonwebtoken';
dotenv.config();

export const connectToGoogle = () => {
   const GoogleStrategy = OAuth2Strategy;
   passport.use(
      new GoogleStrategy(
         {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/api/auth/google/redirect',
         },
         async function (accessToken, refreshToken, profile, done) {
            try {
               const user = await validateUser({
                  email: profile.emails[0].value,
                  userName: profile.displayName,
               });

               delete user.password;

               const refreshToken = jwt.sign({ _id: user._id }, process.env.SERECT_REFRESHTOKEN_KEY, {
                  expiresIn: '1d',
               });

               const accessToken = jwt.sign({ _id: user._id }, process.env.SERECT_ACCESSTOKEN_KEY, {
                  expiresIn: '1m',
               });

               return done(null, {
                  accessToken,
                  refreshToken,
                  data: user,
               });
            } catch (error) {
               console.log(error.message);
            }
         },
      ),
   );

   passport.serializeUser(function (user, cb) {
      cb(null, user);
   });

   passport.deserializeUser(async function (obj, cb) {
      const user = await User.findById(obj.data.id);
      delete user?.password;
      return user ? cb(null, user) : cb(null, null);
   });
};
