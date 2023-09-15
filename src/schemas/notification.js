import joi from 'joi';

export const userNotificationSchema = joi.object({
   userId: joi.string().required().trim(),
   content: joi.string().required().trim(),
   isRead: joi.boolean().default(false),
   link: joi.string().required().trim(),
   type: joi.string().valid('error','message').default('message'),
});

export const globalNotificationSchema = joi.object({
    
    content: joi.string().required().trim(),
    broadCast: joi.boolean().default(false),
    link: joi.string().required().trim(),
    image: joi.string().trim(),
    
 });