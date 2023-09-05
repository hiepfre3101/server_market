import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
   {
      brandName: {
         type: String,
         required: true,
      },
      products: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
         },
      ],
      image: {
         type: String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false },
);
const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
