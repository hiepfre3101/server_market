import Joi from 'joi';

export const productSchema = Joi.object({
   productName: Joi.string().required(),
   price: Joi.number().required(),
   categoryId: Joi.string().required(),
   brandId: Joi.string().required(),
   subCateId: Joi.string().required(),
   desc: Joi.string().required(),
   unit: Joi.string().required(),
   amount: Joi.number().required(),
   discount: Joi.number().max(100),
   images: Joi.array().items().required(),
});
