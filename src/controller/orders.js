import Order from "../models/orders"
import Cart from "../models/cart"
import User from "../models/user"
// Tạo mới đơn hàng
export const createOrder = async (req, res) => {
    try {
        const { customerName, address, phoneNumber, note } = req.body
        const cartId = req.user.cartId
        const cart = await Cart.findById(cartId).populate("products.productId")
        // console.log(cart);
        let totalPrice = 0
        const products = cart.products.map(item => {
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            }
        })
        // console.log("products",products);
        for (let item of cart.products) {
            const sum = item.productId.price * item.quantity
            totalPrice += sum
        }
        const order = await Order.create({
            userId: req.user._id,
            customerName,
            address,
            phoneNumber,
            note,
            products: products,
            totalPrice
        })
        await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } })
        await Cart.findByIdAndUpdate(cartId, { products: [] })
        return res.status(201).json({
            message: 'Order created successfully',
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
// Lấy đơn hàng user
export const getOrdersUser = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
        if (orders.length == 0) {
            return res.json({
                message: "Order empty",
                orders
            })
        }
        return res.status(201).json({
            message: "Get orders successfully",
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
// Admin lấy đơn hàng
export const getOrderAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
        if (orders.length == 0) {
            return res.json({
                message: "Order empty",
                orders
            })
        }
        return res.status(201).json({
            message: "Get orders successfully",
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//Cập nhật đơn hàng
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        const validStatuses = ["Chờ xác nhận", "Đang giao hàng", "Đã hoàn thành", "Đã hủy"];
        if (!validStatuses.includes(status)) {
          return res.status(402).json({ message: "Invalid status update" });
        }
    
        const currentStatusIndex = validStatuses.indexOf(currentOrder.status);
        const newStatusIndex = validStatuses.indexOf(status);
        if (newStatusIndex < currentStatusIndex) {
          return res.status(401).json({ message: "Invalid status update. Status can only be updated in a sequential order." });
        }
    
       const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body,{new:true})
        return res.status(200).json({
            message: "Update order status successfully",
            order: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
// chi tiết đơn hàng
export const getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("products.productId")
        if (!order) {
            return res.status(401).json({
                message: "Order not found"
            })
        }
        return res.status(201).json({
            message: "Get detail order successfully",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//Hủy đơn hàng
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true }).populate("products.productId")
        return res.status(201).json({
            message: "Canceled order",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}