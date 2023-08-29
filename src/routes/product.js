import { Router } from 'express';
import { createProduct, getAllProduct } from '../controller/product';
import { responseSender } from '../middleware/configResponse';

const productRouter = Router();
productRouter.post('/products', createProduct, responseSender);
productRouter.get('/products',getAllProduct,responseSender);
export default productRouter;
