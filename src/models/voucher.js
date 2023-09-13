import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      code: {
         type: String,
         required: true,
      },
      voucher_status: {
         type: Boolean,
         required: true,
      },
      quantity: {
         type: Number,
         required: true,
      },
      date_start: {
         type: Date,
         required: true,
      },
      date_end: {
         type: Date,
         required: true,
      },
      reduction_amount: {
        type: Number,
        required: true,
      },
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('Voucher', voucherSchema);