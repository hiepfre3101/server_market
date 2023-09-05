import { Router } from 'express';
import { createBrand, getAllBrand } from '../controller/brand';
import { responseSender } from '../middleware/configResponse';

const brandRoute = Router();

brandRoute.get('/brands', getAllBrand, responseSender);
brandRoute.post('/brands', createBrand, responseSender);

export default brandRoute;
