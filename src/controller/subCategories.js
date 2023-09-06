import Category from '../models/categories';
import SubCategory from '../models/subCategories';
import { subCategorySchema } from '../schemas/subCategories';
import { typeRequestMw } from '../middleware/configResponse';
import Product from '../models/product';

const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;
export const createSubCategory = async (req, res, next) => {
   try {
      const { error } = subCategorySchema.validate(req.body, { abortEarly: false });
      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }
      const subCategory = await SubCategory.create(req.body);
      if (!subCategory) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Create SubCategory failed`;
         return next();
      }
      await Category.findByIdAndUpdate(req.body.categoryId, { $addToSet: { subCategories: subCategory._id } });
      req[RESPONSE_MESSAGE] = `Create SubCategory successfully`;
      req[RESPONSE_OBJ] = subCategory;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
export const updateSubCategory = async (req, res, next) => {
   try {
      const { error } = subCategorySchema.validate(req.body, { abortEarly: false });
      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }
      const { id } = req.params;
      const existSubCategory = await SubCategory.findById({ _id: id });
      if (!existSubCategory) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `SubCategory is not exist`;
         return next();
      }
      //remove id product from Category if product delete categoryId
      await Category.findByIdAndUpdate(existSubCategory.categoryId, {
         $pull: {
            subCategories: existSubCategory._id,
         },
      });
      //add id product from Category if product add categoryId
      await Category.findOneAndUpdate(
         { _id: req.body.categoryId },
         {
            $addToSet: {
               subCategories: existSubCategory._id,
            },
         },
      );
      const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      req[RESPONSE_MESSAGE] = `SubCategory update successfully`;
      req[RESPONSE_OBJ] = subCategory;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
export const removeSubCategories = async (req, res, next) => {
   try {
      const subCategory = await SubCategory.findOne({ _id: req.params.id });
      // update lại id cate của các sản phẩm trong danh mục muốn xóa thành id cate defaultCategory
      await Product.updateMany({ subCateId: subCategory._id }, { $set: { subCateId: null } });
      await Category.updateMany(
         {},
         {
            $pull: {
               subCategories: subCategory._id,
            },
         },
      );
      const removeSubCategory = await SubCategory.findOneAndDelete({ _id: req.params.id });
      if (!removeSubCategory) {
         req[RESPONSE_STATUS] = 400;
         req[RESPONSE_MESSAGE] = `Not found subCategory`;
         return next();
      }
      req[RESPONSE_MESSAGE] = `Delete subCategory successfully`;
      req[RESPONSE_OBJ] = removeSubCategory;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
export const getAllSubCategory = async (req, res, next) => {
   try {
      const subCategory = await SubCategory.find();
      if (subCategory.length === 0) {
         req[RESPONSE_MESSAGE] = `Not found any subCategories`;
         req[RESPONSE_OBJ] = subCategory;
         next();
      }
      req[RESPONSE_MESSAGE] = `Get all subCategories successfully`;
      req[RESPONSE_OBJ] = subCategory;
      return next();
   } catch (error) {
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      req[RESPONSE_STATUS] = 500;
      return next();
   }
};
export const getOneSubCategory = async (req, res, next) => {
   try {
      const subCategory = await SubCategory.findById(req.params.id).populate('categoryId');
      if (!subCategory) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Get one subCategory failed`;
         return next();
      }
      req[RESPONSE_MESSAGE] = `Get one subCategory successfully`;
      req[RESPONSE_OBJ] = subCategory;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
