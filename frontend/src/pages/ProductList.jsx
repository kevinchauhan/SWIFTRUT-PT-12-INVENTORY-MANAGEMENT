import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore()

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (productId) => {
        const selectedProduct = products.find((product) => product.id === productId);
        if (!selectedProduct) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProductIndex = cart.findIndex((item) => item.id === productId);
        if (existingProductIndex !== -1) {
            // Update quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                ...selectedProduct,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(`Product ID ${productId} added to cart!`);
    };

    const getCartItemCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div key={product.id} className="card bg-base-100 shadow-md">
                        <figure className="w-full h-48 bg-gray-300">
                            <img
                                src={product.image || "https://via.placeholder.com/150"}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{product.name}</h2>
                            <p className="text-gray-500">Price: ${product.price.toFixed(2)}</p>
                            <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </p>
                            {user?.role === 'user' && <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(product.id)}
                                    disabled={product.stock <= 0}
                                >
                                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                </button>
                            </div>}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ProductList;
