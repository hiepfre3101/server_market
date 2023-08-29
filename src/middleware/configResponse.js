export const responseSender = (req, res, next) => {
   const data = {};
   data.body = req.responseObj;
   data.status = req.responseStatus || 200;
   data.message = req.responseMessage || 'Success';
   return res.status(data.status).json(data);
};
