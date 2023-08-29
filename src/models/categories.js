import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
   {
      cateName: {
         type: String,
         required: true,
      },
      productId: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
         },
      ],
      subCategories: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
         },
      ],
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Category', categorySchema);
