import { typeRequestMw } from '../middleware/configResponse';
import Voucher from '../models/voucher';
import { voucherSchema } from '../schemas/voucher';
const { RESPONSE_MESSAGE, RESPONSE_STATUS, RESPONSE_OBJ } = typeRequestMw;
export const createVoucher = async (req, res, next) => {
  try {
    const { error } = voucherSchema.validate(req.body);
    if(error){
        req[RESPONSE_STATUS] = 500;
        req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
        return next();
    }
    // Check the voucher code to see if it exists or not
    const codeExist = await Voucher.find({code: req.body.code})
    if(codeExist) {
      req[RESPONSE_STATUS] = 500;
      req[RESPONSE_MESSAGE] = `Code voucher exist`;
      return next();
    }
    const voucher = await Voucher.create(req.body);
    if (!voucher) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Create Voucher failed`;
       return next();
    }
    req[RESPONSE_MESSAGE] = `Create Voucher successfully`;
    req[RESPONSE_OBJ] = voucher;
    return next();
  } catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
    return next();
  }
}
export const updateVoucher = async (req, res, next) => {
  try {
    const { error } = voucherSchema.validate(req.body);
    if(error){
        req[RESPONSE_STATUS] = 500;
        req[RESPONSE_MESSAGE] = `Form error: ${error.details[0].message}`;
        return next();
    }
    const { id } = req.params;

    const voucher = await Voucher.findByIdAndUpdate(id,req.body, { new: true });
    if (!voucher) {
       req[RESPONSE_STATUS] = 500;
       req[RESPONSE_MESSAGE] = `Voucher is not exist`;
       return next();
    }
    req[RESPONSE_MESSAGE] = `Update Voucher successfully`;
    req[RESPONSE_OBJ] = voucher;
    return next();
  } catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
    return next();
  }
}
export const getAllVoucher = async (req, res, next) => {
  try {
    const { error } = voucherSchema.validate(req.body);
    const voucher = await Voucher.find();
    if (voucher.length === 0) {
      req[RESPONSE_MESSAGE] = `Not found any vouchers`;
      req[RESPONSE_OBJ] = voucher;
      return next();
   }
    req[RESPONSE_MESSAGE] = `Get all Voucher successfully`;
    req[RESPONSE_OBJ] = voucher;
    return next();
  } catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
    return next();
  }
}
export const getOneVoucher = async (req, res, next) => {
  try {
    const { error } = voucherSchema.validate(req.body);

    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      req[RESPONSE_MESSAGE] = `Get voucher failed`;
      req[RESPONSE_OBJ] = voucher;
      return next();
   }
    req[RESPONSE_MESSAGE] = `Get voucher successfully`;
    req[RESPONSE_OBJ] = voucher;
    return next();
  } catch (error) {
    req[RESPONSE_STATUS] = 500;
    req[RESPONSE_MESSAGE] = `Error: ${error.message}`;
    return next();
  }
}