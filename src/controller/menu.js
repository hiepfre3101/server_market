import Menu from '../models/menu'
import Product from '../models/product'
import { menuSchema } from '../schemas/menu'
import { typeRequestMw } from '../middleware/configResponse';


const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;

export const createMenu = async (req, res, next) => {

   try {
      const { error } = menuSchema.validate(req.body, { abortEarly: false })
      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }
      const menu = await Menu.create(req.body);
      if (!menu) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Menu failed`;
         return next();
      }
      const promises = menu.products.map(product => {
         return Product.findByIdAndUpdate({ _id: product.productId }, { $addToSet: { menuId: menu._id } })
      })
      await Promise.all(promises)
      req[RESPONSE_MESSAGE] = `Create menu successfully`;
      req[RESPONSE_OBJ] = menu;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
}

export const updateMenu = async (req, res, next) => {
   try {
      const { error } = menuSchema.validate(req.body, { abortEarly: false });
      if (error) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
         return next();
      }
      const { id } = req.params;
      const exitsMenu = await Menu.findById({ _id: id });
      if (!exitsMenu) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Menu is not exist`;
         return next();
      }
      const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
      req[RESPONSE_MESSAGE] = `update menu successfully`;
      req[RESPONSE_OBJ] = menu;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};


export const removeMenu = async (req, res, next) => {
   try {




      const removedMenu = await Menu.findOneAndDelete({ _id: req.params.id });
      if (!removedMenu) {
         req[RESPONSE_STATUS] = 400;
         req[RESPONSE_MESSAGE] = `Not found menu`;
         return next();
      }
      req[RESPONSE_MESSAGE] = `Delete menu successfully`;
      req[RESPONSE_OBJ] = removedMenu;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const getAllMenu = async (req, res, next) => {
   const {
      _sort = 'createAt',
      _order = 'asc',
      _limit = 100000,
      _page = 1,
      _expand,
      _q = '',
      _from = 1,
      _to = 10000000,
      _product = '',

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
   if (_product) {
      filters.productId = _product;
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
               path: 'products.productId',
               select: ['productName', 'image', '_id', 'price'],

            },

         ]
         : [];
   try {
      const menus = await Menu.paginate(
         { ...optionsSearch, ...filters },
         { ...options, populate: populated },
      );
      if (menus.docs.length === 0) {
         req[RESPONSE_MESSAGE] = `Not found any menus`;
         req[RESPONSE_OBJ] = menus;
         return next();
      }
      req[RESPONSE_OBJ] = menus;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};

export const getOneMenu = async (req, res, next) => {
   try {
      const menu = await Menu.findById(req.params.id).populate([{
         path: 'products.productId',
         select: ['productName', 'image', '_id', 'price'],
      }])
      if (!menu) {
         req[RESPONSE_STATUS] = 500;
         req[RESPONSE_MESSAGE] = `Get one menu failed`;
         return next();
      }
      req[RESPONSE_MESSAGE] = `Get one menu successfully`;
      req[RESPONSE_OBJ] = menu;
      return next();
   } catch (error) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
      return next();
   }
};