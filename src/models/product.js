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
      },
      subCateId: {
         type: mongoose.Types.ObjectId,
         require: true,
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
      volumn: {
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
const Product = mongoose.model('product', productSchema);

export default Product;
