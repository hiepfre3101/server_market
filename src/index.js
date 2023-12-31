import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRouter from './routes/categories';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import brandRoute from './routes/brand';
import subCategories from './routes/subCategories';
import voucher from './routes/voucher';
import uploadRouter from './routes/upload';
import menuRouter from './routes/menu';
import cartRouter from './routes/cart';
import orderRouter from './routes/orders';
import notificationRouter from './routes/notification';
import session from 'express-session';
import { connectToGoogle } from './config/googleOAuth';
// import { connectToFacebook } from './config/facebookOAuth';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_LOCAL;
console.log(PORT, MONGO_URL);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
   session({
      resave: false,
      saveUninitialized: true,
      secret: 'SECRET',
   }),
);

connectToGoogle()
// connectToFacebook()

app.use('/api', categoryRouter);
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', brandRoute);
app.use('/api', subCategories);
app.use('/api', voucher);
app.use('/api', uploadRouter);
app.use('/api', menuRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', notificationRouter);

mongoose
   .connect(MONGO_URL)
   .then(() => console.log('connected to db'))
   .catch((err) => console.log(`error in connect db : ${err}`));
app.listen(PORT, () => {
   console.log(`listening success ${PORT}`);
});
