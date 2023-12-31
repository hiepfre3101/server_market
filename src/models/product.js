import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
   {
      productName: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      categoryId: {
         type: mongoose.Types.ObjectId,
         require: true,
         ref: 'Category',
      },
      subCateId: {
         type: mongoose.Types.ObjectId,
         require: true,
         ref:"SubCategory"
      },
      brandId: {
         type: mongoose.Types.ObjectId,
         require: true,
         ref: 'Brand',
      },
      commentId: [
         {
            type: mongoose.Types.ObjectId,
            require: true,
         },
      ],
      desc: {
         type: String,
         required: true,
      },
      weight: {
         type: Number,
      },
      volume: {
         type: Number,
      },
      unit: {
         type: String,
         required: true,
      },
      discount: {
         type: Number,
         default: 0,
      },
      amount: {
         type: Number,
         required: true,
      },
      images: {
         type: Array,
         required: true,
         default: [],
      },
   },
   { timestamps: true, versionKey: false },
);

productSchema.plugin(paginate);
productSchema.index({ productName: 'text' });
const Product = mongoose.model('Product', productSchema);

export default Product;
