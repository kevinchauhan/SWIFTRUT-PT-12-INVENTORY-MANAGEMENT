import { useState, useEffect } from "react";
import axios from "axios";

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([
        {
            "id": "12345",
            "date": "2024-12-20T15:30:00Z",
            "totalAmount": 59.98,
            "status": "Completed",
            "items": [
                { "name": "Product 1", "quantity": 2, "price": 25.99 },
                { "name": "Product 2", "quantity": 1, "price": 12.49 }
            ],
            "customer": {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "address": "123 Main St, City, Country"
            }
        },
        {
            "id": "67890",
            "date": "2024-12-22T10:00:00Z",
            "totalAmount": 40.00,
            "status": "Pending",
            "items": [
                { "name": "Product 3", "quantity": 1, "price": 40.00 }
            ],
            "customer": {
                "name": "Jane Smith",
                "email": "janesmith@example.com",
                "address": "456 Oak St, City, Country"
            }
        },
        {
            "id": "11223",
            "date": "2024-12-23T08:15:00Z",
            "totalAmount": 149.99,
            "status": "Processing",
            "items": [
                { "name": "Product 4", "quantity": 3, "price": 49.99 },
                { "name": "Product 5", "quantity": 2, "price": 25.00 }
            ],
            "customer": {
                "name": "Michael Brown",
                "email": "michaelbrown@example.com",
                "address": "789 Pine St, City, Country"
            }
        },
        {
            "id": "44556",
            "date": "2024-12-24T14:00:00Z",
            "totalAmount": 19.99,
            "status": "Canceled",
            "items": [
                { "name": "Product 6", "quantity": 1, "price": 19.99 }
            ],
            "customer": {
                "name": "Emily White",
                "email": "emilywhite@example.com",
                "address": "321 Maple St, City, Country"
            }
        }
    ]);
    const [loading, setLoading] = useState(true);

    // Fetch all orders from the API
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders`);
            // setOrders(response.data);
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
                `${import.meta.env.VITE_BACKEND_API_URL}/api/orders/${orderId}`,
                { status: newStatus }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
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
                                <tr key={order.id} className="border-b">
                                    <td className="py-4">{order.id}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateOrderStatus(order.id, e.target.value)
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
