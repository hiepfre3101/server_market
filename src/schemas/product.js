import Joi, { string } from 'joi';

export const productSchema = Joi.object({
   productName: Joi.string().required(),
   price: Joi.number().required(),
   categoryId: Joi.string().required(),
   subCateId: Joi.string().required(),
   commentId: Joi.array().items(string).required(),
   desc: Joi.string().required(),
   unit: Joi.string().required(),
   amount: Joi.number().required(),
   discount: Joi.number().max(100),
});
