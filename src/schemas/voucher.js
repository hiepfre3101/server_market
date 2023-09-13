import JoiBase from 'joi';
import JoiDate from "@joi/date";
const Joi = JoiBase.extend(JoiDate)
export const voucherSchema = Joi.object({
    title: Joi.string().required(),
    code: Joi.string().required(),
    voucher_status: Joi.boolean().required(),
    quantity: Joi.number().min(1).required(),
    date_start: Joi.date().format('YYYY-MM-DD').greater(Joi.ref('date_end')).required(),
    date_end: Joi.date().format('YYYY-MM-DD').required(),
    reduction_amount: Joi.number().min(1).required(),
 });