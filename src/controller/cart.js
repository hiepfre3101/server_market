import Cart from "../models/cart"
import User from "../models/user"
//Lấy giỏ hàng theo idUser
export const getCartUser = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
        if (!cart) {
            return res.json({
                message: "Cart empty",
            })
        }
        await cart.populate("products.productId")
        return res.status(201).json({
            message: "Get cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
 }
}
// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body
    const userId = req.user._id
    let cart = await Cart.findOne({ userId: userId })
    if (!cart) {
        cart = await Cart.create({
            userId: userId,
            products: [],
        })
        await User.findByIdAndUpdate(req.user._id, { cartId: cart._id })
    }
    const productIndex = cart.products.find(item => item.productId == productId)
    if (!productIndex) {
        cart.products.push({ productId, quantity })
    } else {
        productIndex.quantity += quantity
    }
    cart.save()
    return res.status(201).json({
        message: "Add to cart success",
        cart
    })
}
//update lại số lượng sp (.) giỏ hàng
export const updateQuantityProductInCart = async (req, res) => {
    try {
        const { quantity, productId } = req.body
        const cart = await Cart.findOne({ userId: req.user._id })
        const productExits = cart.products.find(item => item.productId == productId)
        //  console.log("exits :", productExits);
        productExits.quantity = quantity
        cart.save()
        // await cart.populate("products.productId")
        return res.status(201).json({
            message: "Update successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
 }
}
//Xóa 1 sản phẩm (.) giỏ hàng
export const removeOneProductInCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId } = req.body
        const cart = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId } } },
            { new: true }
        )
        if (cart.products.length == 0) {
            return res.json({
                message: "Cart empty",
            })
        }
        // await cart.populate("products.productId")
        return res.status(201).json({
            message: "Remove one product in cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
