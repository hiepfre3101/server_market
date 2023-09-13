
import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const menuSchema = new mongoose.Schema(
   {
      menuName: {
         type: String,
         required: true,
      },
      products: [
         {
            productId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'product',
            },
            quantity: {
               type: Number,
               required: true,
            },
            _id: {
               type: String,
               default: undefined
            }

         },
      ],

      image: {
         type: String,
         required: true,
      },
   },
   { timestamps: true, versionKey: false },
);
menuSchema.plugin(paginate);
menuSchema.index({ menuName: 'text' })
const Menu = mongoose.model('menu', menuSchema)
export default Menu