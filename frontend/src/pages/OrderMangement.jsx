import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Redirect to homepage if the user is not an admin
    useEffect(() => {
        if (user?.role !== "admin") {
            navigate("/"); // Redirect if not admin
        }
    }, [user, navigate]);

    // Fetch all orders from the API
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders`);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/orders/${orderId}/status`,
                { status: newStatus }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Management</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-600">No orders to display.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="table w-full text-gray-800">
                        <thead className="bg-gray-200 text-gray-800">
                            <tr>
                                <th className="text-sm font-medium py-2">Order ID</th>
                                <th className="text-sm font-medium py-2">Date</th>
                                <th className="text-sm font-medium py-2">Total</th>
                                <th className="text-sm font-medium py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b">
                                    <td className="py-4">{order._id}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateOrderStatus(order._id, e.target.value)
                                            }
                                            className={`select select-bordered bg-white w-full max-w-xs 
            ${order.status === "Completed" ? "text-green-600" :
                                                    order.status === "Pending" ? "text-yellow-600" :
                                                        order.status === "Processing" ? "text-blue-600" : "text-red-600"}`}
                                        >
                                            <option value="Pending" className="text-yellow-600">Pending</option>
                                            <option value="Processing" className="text-blue-600">Processing</option>
                                            <option value="Completed" className="text-green-600">Completed</option>
                                            <option value="Canceled" className="text-red-600">Canceled</option>
                                        </select>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderManagementPage;
