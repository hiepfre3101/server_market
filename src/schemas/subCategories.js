import joi from 'joi';

export const subCategorySchema = joi.object({
   subCateName: joi.string().required().trim(),
   categoryId: joi.string().required().trim(),
   brands: joi.array().items(joi.string().required()),
});
