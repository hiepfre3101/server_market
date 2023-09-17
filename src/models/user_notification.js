import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema(
   {
     
      userId: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      content:{
        type: String,
        required: true,
     }, 
        
      isRead: {
         type: Boolean,
         default: false,
      },
      link: {
        type: String,
        required: true,
     },
     
      type: {
         type: String,
         enum: ['error', 'message'],
         default: 'message',
      },
   },
   { timestamps: true, versionKey: false },
);

export default mongoose.model('UserNotification', userNotificationSchema);
