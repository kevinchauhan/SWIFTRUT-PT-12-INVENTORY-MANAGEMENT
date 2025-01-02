import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore"; // Assuming you use Zustand for global state management

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isAuthenticated } = useAuthStore();

    // Fetch cart items from localStorage
    const fetchCartItems = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
        setLoading(false);
    };

    // Update product quantity in cart
    const updateQuantity = (productId, quantity) => {
        const updatedCart = cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
    };

    // Calculate total amount in cart
    const getTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Fetch cart items if user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchCartItems();
        } else {
            setLoading(false); // Set loading to false if not authenticated
        }
    }, [isAuthenticated]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center text-gray-600">Your cart is empty.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="table w-full text-gray-800">
                        <thead className="bg-gray-200 text-gray-800">
                            <tr>
                                <th className="text-sm font-medium py-2">Product</th>
                                <th className="text-sm font-medium py-2">Price</th>
                                <th className="text-sm font-medium py-2">Quantity</th>
                                <th className="text-sm font-medium py-2">Total</th>
                                <th className="text-sm font-medium py-2">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-4">
                                        <div className="flex items-center">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                            <span className="ml-4">{item.name}</span>
                                        </div>
                                    </td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="input input-bordered bg-white w-20 text-gray-800"
                                        />
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="btn btn-error btn-xs text-white hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Total: ${getTotalAmount()}</h2>
                <button className="btn btn-primary text-white hover:bg-blue-600">Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default CartPage;
