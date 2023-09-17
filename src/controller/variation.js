import { typeRequestMw } from '../middleware/configResponse';
import Product from '../models/product';
import Variation from '../models/variation';
import { variationSchema } from '../schemas/variation';

const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;
export const createVariation = async (req, _, next) => {
   const { error } = variationSchema.validate(req.body);
   if (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
      return next();
   }
   try {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Can not find any products`;
         return next();
      }
      const variation = await Variation.create(req.body);
      if (!variation) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Create failed`;
         return next();
      }
      await Product.findByIdAndUpdate({ _id: productId }, { $addToSet: { variations: variation._id } }, { new: true });
      req[RESPONSE_OBJ] = variation;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const getVariationByProductId = async (req, _, next) => {
   try {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Can not find any products`;
         return next();
      }
      const variations = product.variations;
      req[RESPONSE_OBJ] = variations;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const updateVariation = async (req, _, next) => {
   const { error } = variationSchema.validate(req.body);
   if (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
      return next();
   }
   try {
      const { id } = req.params;
      const existVariation = await Variation.findById(id);
      if (!existVariation) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Can not find any variations`;
         return next();
      }
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Can not find any products`;
         return next();
      }
      const updatedVariation = await Variation.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      if (productId != existVariation.productId) {
         await Product.findByIdAndUpdate(
            { _id: productId },
            { $addToSet: { variations: updatedVariation._id } },
            { new: true },
         );
      }
      req[RESPONSE_OBJ] = updatedVariation;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const removeVariation = async (req, _, next) => {
   try {
      const { id } = req.params;
      const delVariation = await Variation.findByIdAndDelete(id);
      if (!delVariation) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Delete failed`;
         return next();
      }
      req[RESPONSE_OBJ] = delVariation;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
