import joi from "joi";

export const singupSchema = joi.object({
  userName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
  confirmPassword: joi.string().valid(joi.ref("passWord")).required(),
  phoneNumber: joi.string().min(10),
  address: joi.string(),
  avatar: joi.array().items(joi.string().default('https://res.cloudinary.com/dpwto5xyv/image/upload/v1692587346/learnECMAS/t%E1%BA%A3i_xu%E1%BB%91ng_zdwt9p.png')),
  role: joi
    .string()
    .valid("admin", "contributor", "member")
    .default("member"),
  state: joi.boolean().default(true),
  notifications: joi.array().item(joi.string())
});

export const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
});

export const userSchema = joi.object({
  userName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
  phoneNumber: joi.string().min(10),
  address: joi.string(),
  avatar: joi.array().items(joi.string().default('https://res.cloudinary.com/dpwto5xyv/image/upload/v1692587346/learnECMAS/t%E1%BA%A3i_xu%E1%BB%91ng_zdwt9p.png')),
  role: joi
    .string()
    .valid("admin", "contributor", "member")
    .default("member"),
  state: joi.boolean().default(true),
  notifications: joi.array().item(joi.string())
});