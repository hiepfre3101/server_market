import express from "express";
import authentication from "../middleware/authentication";
import { cancelOrder, createOrder, getOrderDetail, getOrdersUser, updateOrder } from "../controller/orders";

const router = express.Router();
router.get("/order", authentication, getOrdersUser)
router.get("/orderAD", authentication, getOrdersUser)
router.patch("/order/:id", authentication, updateOrder)
router.post("/order", authentication, createOrder)
router.get("/order/:id", authentication, getOrderDetail)
router.put("/order/:id", authentication, cancelOrder)


export default router;