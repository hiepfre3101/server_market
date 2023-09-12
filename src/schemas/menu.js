import joi from 'joi';

export const menuSchema = joi.object({
   menuName: joi.string().required().trim(),
   products: joi.array().required(),
   image: joi.string().required().trim(),
});
