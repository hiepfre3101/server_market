import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    products:[{
        productId:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:"Product"
        },
        quantity:{
            type:Number,
            required:true,
        }
    }     
    ], 

},{timestamps:true, versionKey:false});

export default mongoose.model("Cart", cartSchema)