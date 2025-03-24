import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((res) => {
                if (res.data.isLoggedIn) {
                    setUser(res.data.user);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleLogout = () => {
        window.open("http://localhost:5000/auth/logout", "_self");
    };

    return (
        <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">GitHub Repo Cleanup</h1>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm">
                            Logout
                        </button>
                        <img
                            src={user.photos[0].value}
                            alt="Profile"
                            className="w-7 h-7 border rounded-full border border-white"
                        />
                    </>
                ) : (
                    <button
                        onClick={() => window.open("http://localhost:5000/auth/github", "_self")}
                        className="bg-blue-500 px-3 py-1 rounded text-sm"
                    >
                        Login with GitHub
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
