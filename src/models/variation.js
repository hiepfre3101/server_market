import mongoose from 'mongoose';

const variationSchema = new mongoose.Schema(
   {
      variationName: {
         type: String,
         required: true,
      },
      productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product',
      },
      price: {
         type: Number,
         required: true,
      },
      amount: {
         type: Number,
         required: true,
      },
      unit: {
         type: String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Variation', variationSchema);
