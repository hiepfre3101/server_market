import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import categoryRouter from './routes/categories';
import productRouter from './routes/product';
import brandRoute from './routes/brand';
import subCategories from './routes/subCategories';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_LOCAL;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', brandRoute);
app.use('/api', subCategories);
mongoose
   .connect(MONGO_URL)
   .then(() => console.log('connected to db'))
   .catch((err) => console.log(`error in connect db : ${err}`));
app.listen(PORT, () => {
   console.log(`listening success ${PORT}`);
});
