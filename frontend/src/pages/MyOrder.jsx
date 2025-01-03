import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore"; // Assuming you use Zustand for global state management

const MyOrdersPage = () => {
    const [orders, setOrders] = useState();
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();

    // Fetch orders from API
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

    // Format date for display
    const formatDate = (date) => {
        console.log(date)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false); // Set loading to false if not authenticated
        }
    }, [isAuthenticated]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-600">You have no orders yet.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="table w-full text-gray-800">
                        <thead className="bg-gray-200 text-gray-800">
                            <tr>
                                <th className="text-sm font-medium py-2">Order ID</th>
                                <th className="text-sm font-medium py-2">Date</th>
                                <th className="text-sm font-medium py-2">Total</th>
                                <th className="text-sm font-medium py-2">Status</th>
                                {/* <th className="text-sm font-medium py-2">Details</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order) => (
                                <tr key={order._id} className="border-b">
                                    <td className="py-4">{order._id}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`text-sm font-medium 
            ${order.status === "Completed" ? "text-green-600" :
                                                    order.status === "Pending" ? "text-yellow-600" :
                                                        order.status === "Processing" ? "text-blue-600" : "text-red-600"}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    {/* <td>
                                        <button
                                            onClick={() => alert(`View details for order ID: ${order.id}`)}
                                            className="btn btn-info btn-xs text-white hover:bg-blue-600"
                                        >
                                            View Details
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
