import mongoose from 'mongoose';

const globalNotificationSchema = new mongoose.Schema(
   {
     
    
      content:{
        type: String,
        required: true,
     }, 
        
      broadCast: {
         type: Boolean,
         default: false,
      },
      link: {
        type: String,
        required: true,
     },
     image: {
        type: String,
       
     },
     
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('GlobalNotification', globalNotificationSchema);
