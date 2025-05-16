import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { setFilterType, setSearchQuery } from "./redux/features/slices/repoSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Navbar = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        axios
            .get(`${backendUrl}/auth/user`, { withCredentials: true })
            .then((res) => {
                if (res.data.isLoggedIn) {
                    setUser(res.data.user);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleLogout = () => {
        window.open(`${backendUrl}/auth/logout`, "_self");
    };

    return (
        <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full shadow-md z-50">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">GitSweep</h1>

                {/* Hamburger menu for small screens */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Desktop user info */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <img
                                src={user.photos[0].value}
                                alt={`${user.username}'s profile`}
                                className="w-10 h-10 border rounded-full border-white"
                            />
                            <span className="text-sm">{user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => window.open(`${backendUrl}/auth/github`, "_self")}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition"
                        >
                            Login with GitHub
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden mt-3 flex flex-col gap-3 items-start bg-gray-700 p-4 rounded shadow-md">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2">
                                <img
                                    src={user.photos[0].value}
                                    alt={`${user.username}'s profile`}
                                    className="w-8 h-8 border rounded-full border-white"
                                />
                                <span className="text-sm">{user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition w-full text-left"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => window.open(`${backendUrl}/auth/github`, "_self")}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition w-full text-left"
                        >
                            Login with GitHub
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
