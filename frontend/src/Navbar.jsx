import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setFilterType, setSearchQuery } from "./redux/features/slices/repoSlice";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Navbar = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${backendUrl}/auth/user`, { withCredentials: true })
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
        <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">GitSweep</h1>

            {/* User Info & Logout/Login */}
            <div className="flex items-center gap-3">
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
                        onClick={() => window.open("http://localhost:5000/auth/github", "_self")}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition"
                    >
                        Login with GitHub
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
