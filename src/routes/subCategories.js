import express from 'express';
import {
   getAllSubCategory,
   createSubCategory,
   getOneSubCategory,
   removeSubCategories,
   updateSubCategory,
} from '../controller/subCategories';
import { responseSender } from '../middleware/configResponse';
const router = express.Router();
router.post('/subcategories', createSubCategory, responseSender);
router.patch('/subcategories/:id', updateSubCategory, responseSender);
router.delete('/subcategories/:id', removeSubCategories, responseSender);
router.get('/subcategories/:id', getOneSubCategory, responseSender);
router.get('/subcategories', getAllSubCategory, responseSender);
export default router;
