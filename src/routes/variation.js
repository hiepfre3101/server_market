import { Router } from 'express';
import { createVariation, getVariationByProductId, removeVariation, updateVariation } from '../controller/variation';
import { responseSender } from '../middleware/configResponse';

const variationRouter = Router();

variationRouter.get('/variations', getVariationByProductId, responseSender);
variationRouter.post('/variations', createVariation, responseSender);
variationRouter.patch('/variations/:id', updateVariation, responseSender);
variationRouter.delete('/variations/:id', removeVariation, responseSender);

export default variationRouter;
