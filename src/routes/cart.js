import express  from "express";
import  authentication  from "../middleware/authentication";
import { addToCart, getCartUser, removeOneProductInCart, updateQuantityProductInCart } from "../controller/cart";

const router = express.Router();
router.get("/cart", authentication, getCartUser)
router.post("/cart", authentication, addToCart)
router.patch("/cart", authentication, updateQuantityProductInCart)
router.delete("/cart", authentication, removeOneProductInCart)
export default router;