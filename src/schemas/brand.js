import joi from 'joi';

export const brandSchema = joi.object({
   brandName: joi.string().required().trim(),
   image: joi.string().required().trim(),
});
