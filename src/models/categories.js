import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
   {
      cateName: {
         type: String,
         required: true,
      },
      products: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
         },
      ],
      subCategories: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
         },
      ],
      image: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         enum: ['normal', 'default'],
         default: 'normal',
      },
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Category', categorySchema);
