import UserNotification from "../models/UserNotification";
import GlobalNotification from "../models/GlobalNotification";
import { typeRequestMw } from "../middleware/configResponse";
import { globalNotificationSchema, userNotificationSchema } from "../schemas/notification";
import User from "../models/user";


const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;

// UserNotification
export const createUserNotification = async(req,res,next)=>{
    const { error } = userNotificationSchema.validate(req.body);
    if (error) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
       return next();
    }
try {
    const notification = await UserNotification.create(req.body);
    if (!notification) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Create failed`;
       return next();
    }
    await User.findByIdAndUpdate(
        req.body.userId,
        {
           $addToSet: { notifications: notification._id },
        },
        { new: true },
     );
    req[RESPONSE_OBJ] = notification;
    return next()
} catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
    return next();
}

}

export const deleteUserNotification =async(req, res, next)=>{

try {
    const { id } = req.params;
    const removedNotification = await UserNotification.findByIdAndDelete(id);
    if (!removedNotification) {
       req[RESPONSE_STATUS] = 400;
       req[RESPONSE_MESSAGE] = `Not found Notification`;
       return next();
    }
    await User.findByIdAndUpdate(removedNotification.userId, { $pull: { notifications: id } });

   
    req[RESPONSE_OBJ] = removedNotification;
    return next();
} catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
    return next();
}

}


// globalNatification


export const createGlobalNotification = async(req,res,next)=>{
    const { error } = globalNotificationSchema.validate(req.body);
    if (error) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
       return next();
    }
try {
    const notification = await GlobalNotification.create(req.body);
    if (!notification) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Create failed`;
       return next();
    }
 
    req[RESPONSE_OBJ] = notification;
    return next()
} catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
    return next();
}

}



export const updateGlobalNotification = async(req,res,next)=>{
    const { error } = globalNotificationSchema.validate(req.body);
    if (error) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
       return next();
    }
try {
    const {id} = req.params
     
     const notification = await GlobalNotification.findById(id)
    if (!notification) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Not found`;
       return next();
    }
    await GlobalNotification.findByIdAndUpdate(id,req.body);

    req[RESPONSE_OBJ] = notification;
    return next()
} catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
    return next();
}

}



export const deleteGlobalNotification =async(req, res, next)=>{

try {
    const { id } = req.params;
    const removedNotification = await GlobalNotification.findByIdAndDelete(id);
    if (!removedNotification) {
       req[RESPONSE_STATUS] = 400;
       req[RESPONSE_MESSAGE] = `Not found Notification`;
       return next();
    }
   
   
    req[RESPONSE_OBJ] = removedNotification;
    return next();
} catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Form error: ${error.message}`;
    return next();
}

}