import { Router } from 'express';
import { createProduct, getAllProduct, getOneProduct, removeProduct, updateProduct } from '../controller/product';
import { responseSender } from '../middleware/configResponse';

const productRouter = Router();
productRouter.post('/products', createProduct, responseSender);
productRouter.get('/products', getAllProduct, responseSender);
productRouter.get('/products/:id', getOneProduct, responseSender);
productRouter.patch('/products/:id', updateProduct, responseSender);
productRouter.delete('/products/:id', removeProduct, responseSender);
export default productRouter;
