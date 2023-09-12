import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRouter from './routes/categories';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import brandRoute from './routes/brand';
import subCategories from './routes/subCategories';
import uploadRouter from './routes/upload';
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_LOCAL;
const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api', categoryRouter);
app.use('/api', authRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', brandRoute);
app.use('/api', subCategories);
app.use('/api', uploadRouter);
mongoose
   .connect(MONGO_URL)
   .then(() => console.log('connected to db'))
   .catch((err) => console.log(`error in connect db : ${err}`));
app.listen(PORT, () => {
   console.log(`listening success ${PORT}`);
});
