import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, LogOut, Menu, X, ChevronDown, LayoutDashboard, FilePlus } from 'lucide-react';

const Navbar = ({ userToken, adminToken, userProfile, adminProfile, onUserLogout, onAdminLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add scroll listener for navbar background opacity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleUserLogout = () => {
        onUserLogout();
        navigate('/');
    };

    const handleAdminLogout = () => {
        onAdminLogout();
        navigate('/');
    };

    const getProfileInitials = () => {
        if (adminProfile) {
            return `${adminProfile.firstName?.[0] || ''}${adminProfile.lastName?.[0] || ''}`.toUpperCase() || 'AD';
        }
        if (userProfile) {
            return `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase() || 'US';
        }
        return 'U';
    };

    const getProfileName = () => {
        if (adminProfile) return `${adminProfile.firstName} ${adminProfile.lastName}`;
        if (userProfile) return `${userProfile.firstName} ${userProfile.lastName}`;
        return 'Learner';
    };

    const getProfileEmail = () => {
        if (adminProfile) return adminProfile.email;
        if (userProfile) return userProfile.email;
        return '';
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            scrolled 
                ? 'bg-[#0f1117]/85 backdrop-blur-lg border-b border-slate-800/80 shadow-lg py-3' 
                : 'bg-transparent border-b border-transparent py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 group text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-base shadow-[0_0_20px_rgba(108,92,231,0.3)] group-hover:scale-105 transition-transform duration-300">
                        ◆
                    </span>
                    <span className="bg-gradient-to-r from-white to-[#a4a6b8] bg-clip-text text-transparent">
                        Coursify
                    </span>
                </Link>

                {/* Desktop Menu Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-white ${
                                isActive(link.path) ? 'text-[#6c5ce7]' : 'text-slate-400'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {userToken && (
                        <Link
                            to="/purchases"
                            className={`text-sm font-medium transition-colors hover:text-white ${
                                isActive('/purchases') ? 'text-[#6c5ce7]' : 'text-slate-400'
                            }`}
                        >
                            My Learning
                        </Link>
                    )}
                    {adminToken && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className={`text-sm font-medium transition-colors hover:text-white ${
                                    isActive('/admin/dashboard') ? 'text-[#6c5ce7]' : 'text-slate-400'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/create-course"
                                className={`text-sm font-medium transition-colors hover:text-white ${
                                    isActive('/admin/create-course') ? 'text-[#6c5ce7]' : 'text-slate-400'
                                }`}
                            >
                                Create Course
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Guest Session */}
                    {!userToken && !adminToken && (
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/signin" 
                                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="text-sm font-semibold bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] hover:from-[#5a4bd1] hover:to-[#4b3ec0] text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] transition-all duration-200"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Authenticated Dropdown Menu */}
                    {(userToken || adminToken) && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                    {getProfileInitials()}
                                </div>
                                <span className="text-sm font-medium text-slate-300 pr-1 max-w-[120px] truncate hidden lg:inline">
                                    {getProfileName().split(' ')[0]}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 pr-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2.5 w-60 rounded-xl bg-slate-950/95 border border-slate-800 backdrop-blur-xl shadow-2xl p-2 z-50 pointer-events-auto"
                                    >
                                        {/* User Details */}
                                        <div className="px-3 py-2 border-b border-slate-800 mb-1">
                                            <p className="text-sm font-semibold text-white truncate">{getProfileName()}</p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{getProfileEmail()}</p>
                                            {adminToken && (
                                                <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-900 rounded">
                                                    Instructor
                                                </span>
                                            )}
                                        </div>

                                        {/* Links */}
                                        {adminToken ? (
                                            <>
                                                <Link 
                                                    to="/admin/dashboard" 
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                                    Dashboard
                                                </Link>
                                                <Link 
                                                    to="/admin/create-course" 
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                                >
                                                    <FilePlus className="w-4 h-4 text-slate-400" />
                                                    Publish Course
                                                </Link>
                                            </>
                                        ) : (
                                            <Link 
                                                to="/purchases" 
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                            >
                                                <BookOpen className="w-4 h-4 text-slate-400" />
                                                My Learning
                                            </Link>
                                        )}

                                        <div className="h-px bg-slate-800 my-1"></div>

                                        {/* Logout Button */}
                                        <button
                                            onClick={adminToken ? handleAdminLogout : handleUserLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4 shrink-0" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile hamburger menu */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors text-white"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden bg-slate-950 border-b border-slate-800 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-base font-medium py-1.5 border-b border-slate-900 ${
                                        isActive(link.path) ? 'text-[#6c5ce7]' : 'text-slate-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {userToken && (
                                <Link
                                    to="/purchases"
                                    className={`text-base font-medium py-1.5 border-b border-slate-900 ${
                                        isActive('/purchases') ? 'text-[#6c5ce7]' : 'text-slate-400'
                                    }`}
                                >
                                    My Learning
                                </Link>
                            )}
                            {adminToken && (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        className={`text-base font-medium py-1.5 border-b border-slate-900 ${
                                            isActive('/admin/dashboard') ? 'text-[#6c5ce7]' : 'text-slate-400'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin/create-course"
                                        className={`text-base font-medium py-1.5 border-b border-slate-900 ${
                                            isActive('/admin/create-course') ? 'text-[#6c5ce7]' : 'text-slate-400'
                                        }`}
                                    >
                                        Create Course
                                    </Link>
                                </>
                            )}

                            {/* User details or sign in button */}
                            {userToken || adminToken ? (
                                <div className="mt-2 flex flex-col gap-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center text-sm font-bold text-white shadow-md">
                                            {getProfileInitials()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{getProfileName()}</p>
                                            <p className="text-xs text-slate-400">{getProfileEmail()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={adminToken ? handleAdminLogout : handleUserLogout}
                                        className="w-full flex items-center justify-center gap-2 mt-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-rose-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link 
                                        to="/signin" 
                                        className="w-full text-center py-2.5 rounded-lg border border-slate-800 text-slate-350 font-medium hover:bg-slate-900 hover:text-white transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] text-white font-semibold shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
