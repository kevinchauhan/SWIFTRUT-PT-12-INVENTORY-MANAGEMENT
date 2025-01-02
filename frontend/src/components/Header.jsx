import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import axios from "axios";

const Header = () => {
    const { isAuthenticated, logout, user } = useAuthStore();

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`);
            logout();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md">
            {/* Logo */}
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    E-Shop
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex-none">
                {/* Cart Dropdown - Visible for Customers */}
                {user?.role !== "admin" && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="badge badge-sm indicator-item">8</span>
                            </div>
                        </div>
                        <div
                            tabIndex={0}
                            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
                        >
                            <div className="card-body">
                                <span className="text-lg font-bold">8 Items</span>
                                <span className="text-info">Subtotal: $999</span>
                                <div className="card-actions">
                                    <Link to="/cart" className="btn btn-primary btn-block">
                                        View Cart
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Dropdown */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        {user?.role === "admin" ? (
                            <>
                                <li>
                                    <Link to="/admin/products">Manage Products</Link>
                                </li>
                                <li>
                                    <Link to="/admin/orders">Manage Orders</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/my-orders">My Orders</Link>
                                </li>
                            </>
                        )}
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
