import { useEffect, useState } from "react";
import api from "./utils/api";
import { useDispatch } from "react-redux";
import { Menu, X, Github, LogOut } from "lucide-react";
import { setFilterType, setSearchQuery } from "./redux/features/slices/repoSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const Navbar = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
            dispatch(setFilterType("all"));
            dispatch(setSearchQuery(""));
            return;
        }

        api
            .get('/auth/user')
            .then((res) => {
                if (res.data.isLoggedIn) {
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    dispatch(setFilterType("all"));
                    dispatch(setSearchQuery(""));
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [dispatch]);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        window.open(`${backendUrl}/auth/logout`, "_self");
    };

    const UserSkeleton = () => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
    );

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Github className="h-8 w-8 text-gray-900" />
                        <h1 className="text-xl font-bold text-gray-900">GitSweep</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {loading ? (
                            <UserSkeleton />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar_url}
                                        alt={`${user.login}'s profile`}
                                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                                    />
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{user.name || user.login}</div>
                                        <div className="text-gray-500">@{user.login}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => window.open(`${backendUrl}/auth/github`, "_self")}
                                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                Sign in with GitHub
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        {loading ? (
                            <UserSkeleton />
                        ) : user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                    <img
                                        src={user.avatar_url}
                                        alt={`${user.login}'s profile`}
                                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name || user.login}</div>
                                        <div className="text-sm text-gray-500">@{user.login}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => window.open(`${backendUrl}/auth/github`, "_self")}
                                className="flex items-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                Sign in with GitHub
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;