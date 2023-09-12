import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
   {
      subCateName: {
         type: String,
         required: true,
      },
      products: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
         },
      ],
      categoryId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
         required: true,
      },
      brands: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
         },
      ],
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('SubCategory', subCategorySchema);
