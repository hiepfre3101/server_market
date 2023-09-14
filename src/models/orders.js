
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    customerName: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }
    ],
    deliveryDate: {
        type: Date,
        default: null
    },
    pay: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
        default: null
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Chờ xác nhận",
        enum: ["Chờ xác nhận",
            "Đang giao hàng",
            "Đã hoàn thành",
            "Đã hủy",
        ]
    },
    // voucherId:{
    //     type: mongoose.Types.ObjectId,
    //     ref: "Voucher"
    // }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Order", orderSchema)