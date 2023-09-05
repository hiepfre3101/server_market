import { brandSchema } from '../schemas/brand';
import Brand from '../models/brand';
import { typeRequestMw } from '../middleware/configResponse';

const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;

export const createBrand = async (req, res, next) => {
   const { error } = brandSchema.validate(req.body);
   if (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
      return next();
   }
   try {
      const brand = await Brand.create(req.body);
      if (!brand) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Create failed`;
         return next();
      }
      req[RESPONSE_OBJ] = brand;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
      return next();
   }
};

export const getAllBrand = async (req, res, next) => {
   try {
      const brand = await Brand.find();
      if (!brand) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Get brand failed`;
         return next();
      }
      if (brand?.length === 0) {
         req[RESPONSE_MESSAGE] = `Not found any brand`;
         req[RESPONSE_OBJ] = brand;
         return next();
      }
      req[RESPONSE_OBJ] = brand;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
      return next();
   }
};


