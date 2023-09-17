import Joi from 'joi';

export const variationSchema = Joi.object({
   variationName: Joi.string().required(),
   price: Joi.number().required(),
   unit: Joi.string().required(),
   productId: Joi.string().required(),
   amount: Joi.number().required(),
});
