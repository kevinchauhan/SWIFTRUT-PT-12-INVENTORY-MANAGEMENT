import Order from '../models/Order.js'
import Product from '../models/Product.js'

class OrderController {
    // Place an order
    static async placeOrder(req, res) {
        const { userId, items, totalPrice, status = 'Pending' } = req.body;

        try {
            // Check if the products in the order are available
            for (let item of items) {
                const product = await Product.findById(item.productId);
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                }
            }

            // Create a new order
            const newOrder = new Order({
                user: userId,
                items,
                totalPrice,
                status,
            });

            // Reduce stock for each product
            for (let item of items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            await newOrder.save();
            return res.status(201).json(newOrder);
        } catch (error) {
            console.error('Error placing order:', error);
            return res.status(500).json({ message: 'Error placing order' });
        }
    }

    // Get all orders
    static async getAllOrders(req, res) {
        try {
            const orders = await Order.find().populate('user', 'name email').populate('items.productId', 'name price');
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
    }

    // Get orders for a specific user (customer)
    static async getUserOrders(req, res) {
        const userId = req.user.id; // Extract user id from the request

        try {
            const orders = await Order.find({ user: userId }).populate('items.productId', 'name price');
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return res.status(500).json({ message: 'Error fetching user orders' });
        }
    }

    // Update order status (for admin or authorized personnel)
    static async updateOrderStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ message: 'Error updating order status' });
        }
    }

    // Delete an order (for admin or authorized personnel)
    static async deleteOrder(req, res) {
        const { id } = req.params;

        try {
            const deletedOrder = await Order.findByIdAndDelete(id);

            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Error deleting order:', error);
            return res.status(500).json({ message: 'Error deleting order' });
        }
    }
}

export default OrderController;
