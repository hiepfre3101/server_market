import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_LOCAL;

mongoose
   .connect(MONGO_URL)
   .catch((err) => console.log('error in connect db'))
   .then(() => console.log('connected to db'));
app.listen(PORT, () => {
   console.log('listening success');
});
