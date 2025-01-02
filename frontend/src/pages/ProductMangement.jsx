import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        stock: "",
    });

    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Redirect to homepage if the user is not an admin
    useEffect(() => {
        if (user?.role !== "admin") {
            navigate("/"); // Redirect if not admin
        }
    }, [user, navigate]);

    // Reset form data when productToEdit is null (i.e., when adding a new product)
    useEffect(() => {
        if (!productToEdit) {
            setFormData({
                name: "",
                price: "",
                description: "",
                imageUrl: "",
                stock: "",
            });
        }
    }, [productToEdit]);

    // Fetch all products from the API
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

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Add a new product
    const addProduct = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/products`,
                formData
            );
            setProducts((prevProducts) => [...prevProducts, response.data]);
            toast.success("Product added successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Error adding product!");
        }
    };

    // Edit an existing product
    const editProduct = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/products/${productToEdit._id}`,
                formData
            );
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productToEdit._id ? response.data : product
                )
            );
            toast.success("Product updated successfully!");
            fetchProducts()
            setShowModal(false);
            setProductToEdit(null);
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Error updating product!");
        }
    };

    // Delete a product
    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/products/${productId}`);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== productId)
            );
            toast.success("Product deleted successfully!");
            fetchProducts()
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Error deleting product!");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Product Management</h1>

            {/* Add Product Button */}
            <button
                onClick={() => {
                    setProductToEdit(null); // Reset productToEdit when adding new product
                    setShowModal(true);
                }}
                className="btn btn-primary mb-6"
            >
                Add New Product
            </button>

            {/* Product List Table */}
            {products.length === 0 ? (
                <div className="text-center text-gray-600">No products to display.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="table w-full text-gray-800">
                        <thead className="bg-gray-200 text-gray-800">
                            <tr>
                                <th className="text-sm font-medium py-2">Product Name</th>
                                <th className="text-sm font-medium py-2">Price</th>
                                <th className="text-sm font-medium py-2">Stock</th>
                                <th className="text-sm font-medium py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b">
                                    <td className="py-4">{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setProductToEdit(product);
                                                    setFormData({
                                                        name: product.name,
                                                        price: product.price,
                                                        description: product.description,
                                                        imageUrl: product.imageUrl,
                                                        stock: product.stock,
                                                    });
                                                    setShowModal(true);
                                                }}
                                                className="btn btn-warning btn-xs text-white"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="btn btn-error btn-xs text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Add/Edit Product */}
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {productToEdit ? "Edit Product" : "Add New Product"}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (productToEdit) {
                                    editProduct();
                                } else {
                                    addProduct();
                                }
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="textarea textarea-bordered w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn  bg-gray-200 text-gray-800 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    {productToEdit ? "Update Product" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagementPage;
