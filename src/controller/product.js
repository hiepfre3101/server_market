import Product from '../models/product';
import Category from '../models/categories';
import { productSchema } from '../schemas/product';

export const createProduct = async (req, res, next) => {
   const { error } = productSchema.validate(req.body);
   if (error) {
      req.status = 500;
      req.responseMessage = `Form error ${error.details[0].message}`;
      return next();
   }
   try {
      const product = await Product.create(req.body);
      if (!product) {
         req.status = 500;
         req.responseMessage = 'Database error';
         return next();
      }
      await Category.findByIdAndUpdate({ _id: req.body.categoryId }, { $addToSet: { products: product._id } });
      req.responseObj = product;
      return next();
   } catch (error) {
      req.status = 500;
      req.responseMessage = error.message;
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
      _inStock,
      _outStock,
   } = req.query;
   try {
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
      if (_cate) {
         filters.categoryId = _cate;
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
                 },
              ]
            : [];
      const products = await Product.paginate(
         { price: { $gte: _from, $lte: _to }, ...optionsSearch, ...filters },
         { ...options, populate: populated },
      );
      if (products.docs.length === 0) {
         req.responseMessage = 'Not found any products!';
         req.responseObj = [];
         return next();
      }
      req.responseObj = products;

      return next();
   } catch (error) {
      req.status = 500;
      req.responseMessage = error.message;
      return next();
   }
};
