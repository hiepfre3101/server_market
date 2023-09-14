import Product from '../models/product';
import Category from '../models/categories';
import { productSchema } from '../schemas/product';
import Brand from '../models/brand';
import { typeRequestMw } from '../middleware/configResponse';

const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;
export const createProduct = async (req, res, next) => {
   const { error } = productSchema.validate(req.body);
   if (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
      return next();
   }
   try {
      const product = await Product.create(req.body);
      if (!product) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Create failed`;
         return next();
      }
      await Category.findByIdAndUpdate({ _id: req.body.categoryId }, { $addToSet: { products: product._id } });
      await Brand.findByIdAndUpdate({ _id: req.body.categoryId }, { $addToSet: { products: product._id } });
      req[RESPONSE_OBJ] = product;
      return next();
      
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const getAllProduct = async (req, res, next) => {
   const {
      _sort = 'createAt',
      _order = 'asc',
      _limit = 100000,
      _page = 1,
      _expand,
      _q = '',
      _from = 1,
      _to = 10000000,
      _cate = '',
      _brand = '',
      _subCate = '',
      _inStock,
      _outStock,
   } = req.query;
   const options = {
      page: _page,
      sort: {
         [_sort]: _order === 'desc' ? -1 : 1,
      },
      collation: { locale: 'vi', strength: 1 },
   };
   if (_limit !== undefined) {
      options.limit = _limit;
   }
   const filters = {};
   if (_brand) {
      filters.brandId = _brand;
   }
   if (_cate) {
      filters.categoryId = _cate;
   }
   if (_subCate) {
      filters.subCateId = _subCate;
   }
   if (_inStock == 'true') {
      filters.amount = { $gt: 0 };
   }
   if (_outStock == 'true') {
      filters.amount = 0;
   }
   const optionsSearch = _q !== '' ? { $text: { $search: _q } } : {};
   const populated =
      _expand !== undefined
         ? [
              {
                 path: 'categoryId',
                 select: ['cateName'],
              },
              {
                 path: 'brandId',
                 select: ['brandName', 'image'],
              },
           ]
         : [];
   try {
      const products = await Product.paginate(
         { price: { $gte: _from, $lte: _to }, ...optionsSearch, ...filters },
         { ...options, populate: populated },
      );
      if (products.docs.length === 0) {
         req[RESPONSE_MESSAGE] = `Not found any products`;
         req[RESPONSE_OBJ] = products;
         return next();
      }
      req[RESPONSE_OBJ] = products;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const getOneProduct = async (req, _, next) => {
   try {
      const { id } = req.params;
      const product = await Product.findById(id).populate([
         { path: 'categoryId', select: ['cateName', 'image'] },
         { path: 'brandId', select: ['brandName', 'image'] },
      ]);
      if (!product) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Get product failed`;
         return next();
      }
      req[RESPONSE_OBJ] = product;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const updateProduct = async (req, _, next) => {
   const { error } = productSchema.validate(req.body);
   if (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
      return next();
   }
   try {
      const { id } = req.params;
      const existProduct = await Product.findById({ _id: id });
      if (!existProduct) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Product is not exist`;
         return next();
      }
      if (existProduct.categoryId != req.body.categoryId) {
         await Category.findByIdAndUpdate(existProduct.categoryId, { $pull: { products: existProduct._id } });
         await Category.findByIdAndUpdate(
            req.body.categoryId,
            {
               $addToSet: { products: existProduct._id },
            },
            { new: true },
         );
      }
      if (existProduct.subCateId != req.body.subCateId) {
      }
      if (existProduct.brandId != req.body.brandId) {
         await Brand.findByIdAndUpdate(existProduct.brandId, { $pull: { products: existProduct._id } });
         await Brand.findByIdAndUpdate(req.body.brandId, { $addToSet: { products: existProduct._id } }, { new: true });
      }
      const newProduct = await Product.findByIdAndUpdate({ _id: id }, req.body, { new: true });
      req[RESPONSE_OBJ] = newProduct;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const removeProduct = async (req, _, next) => {
   try {
      const { id } = req.params;
      const removedProduct = await Product.findByIdAndDelete(id);
      if (!removedProduct) {
         req[RESPONSE_STATUS] = 400;
         req[RESPONSE_MESSAGE] = `Not found product`;
         return next();
      }
      await Category.findByIdAndUpdate(removedProduct.categoryId, { $pull: { products: id } });
      await Brand.findByIdAndUpdate(removedProduct.brandId, { $pull: { products: removedProduct.id } });
      req[RESPONSE_OBJ] = removedProduct;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};
