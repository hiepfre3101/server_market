import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/user';
import { validateUser } from '../controller/auth';
import jwt from 'jsonwebtoken';
dotenv.config();

export const connectToFacebook = () => {
   passport.use(
      new FacebookStrategy(
         {
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: 'http://localhost:8000/api/auth/facebook/redirect',
            enableProof: true,
            profileFields: ['id', 'displayName', 'photos', 'emails'],
         },
         async function (accessToken, refreshToken, profile, done) {
            try {
               const user = await validateUser({
                  email: profile.emails[0].value,
                  userName: profile.displayName,
                  picture: profile.photos[0].value,
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
               return done(null, profile);
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
