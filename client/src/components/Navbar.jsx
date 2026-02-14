import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import CyclePortLogo from "../assets/CyclePort-Logo.svg";
import ThemeToggle from "./ThemeToggle";
import { toast } from "react-toastify";
import { FiChevronDown } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import Avatar from "../components/Avatar";
import axios from "../utils/axios";

function Navbar() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { items: cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef();
  const cartRef = useRef();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsCartOpen(false);
  }, [user]);

  const handleLogout = () => {
    try {
      dispatch(logout());
      dispatch(clearCart());
      setIsMobileMenuOpen(false);
      toast.success("Logged out successfully.", { className: "toastSuccess" });
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = async () => {
    const query = searchTerm.trim();
    if (!query) return;

    try {
      const { data } = await axios.get(`/api/products?name=${query}`);
      const products = Array.isArray(data) ? data : data.products || [];

      const exactMatch = products.find(
        (p) => p.name?.trim().toLowerCase() === query.toLowerCase()
      );

      setIsMobileMenuOpen(false);
      setSearchTerm("");

      if (exactMatch) {
        navigate(`/products/${exactMatch._id}/${exactMatch.slug}`);
      } else if (products.length > 0) {
        navigate(`/products?name=${query}`);
      } else {
        toast.info(`No cycle named "${query}" found.`);
      }
    } catch (err) {
      console.error("Search error:", err.message);
      toast.error("Failed to search products.");
    }
  };

  const formatCurrency = (amount) => 
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <nav
      className="navContainer flex flex-col md:flex-row items-center justify-between gap-4 px-4 pt-2 pb-0"
      aria-label="Main navigation"
    >
      {/* Logo + Hamburger */}
      <div className="w-full flex items-center justify-between md:w-auto">
        <NavLink
          to="/"
          className="flex items-center space-x-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={CyclePortLogo} alt="CyclePort Logo" className="w-10 h-14" />
          <span className="navLogo">CyclePort</span>
        </NavLink>
        <button
          className="hamburgerBtn text-2xl md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Desktop Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit();
        }}
        className="flex-grow max-w-md hidden md:flex items-center md:ml-6"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search cycles..."
          className="w-full px-3 py-2 rounded border text-sm dark:bg-[var(--color-charcoal-700)] dark:text-white"
          aria-label="Search cycles"
        />
        <button
          type="submit"
          className="ml-2 px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li>
          <NavLink to="/" className="navLink">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products" className="navLink">Products</NavLink>
        </li>

        {!user && (
          <>
            <li><NavLink to="/login" className="navLink">Login</NavLink></li>
            <li><NavLink to="/register" className="navLink">Register</NavLink></li>
          </>
        )}

        {user?.role === "user" && (
          <>
            {/* Cart Preview */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="navLink relative"
                aria-label="Toggle cart preview"
              >
                <div className={`relative ${isCartPage ? "text-teal-400" : ""}`}>
                  <FaShoppingCart size={28} />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-1 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </div>
              </button>

              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 p-4 space-y-2 z-50 rounded shadow-lg 
                                border border-gray-200 dark:border-[var(--color-charcoal-700)] 
                                bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] 
                                dark:text-white">
                  {cart.length === 0 ? (
                    <p className="text-sm text-gray-500">Your cart is empty.</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item._id} className="flex justify-between items-center text-sm">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                      <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>
                            {formatCurrency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                          </span>
                        </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate("/cart");
                        }}
                        className="btnPrimary w-full mt-2 cursor-pointer"
                      >
                        View Full Cart
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 navLink"
                aria-label="Toggle profile dropdown"
              >
                <Avatar 
                  src={
                    user?.avatar?.startsWith('/uploads')
                    ? `${import.meta.env.VITE_API_URL}${user.avatar}`
                    : user?.avatar || "default-avatar.png"
                  } 
                  className="w-8 h-10 object-cover rounded-full" 
                />
                {/* Hide welcome text on small screens */}
                <span className="hidden md:inline">
                  Welcome, {user?.name?.split(" ")[0] || "User"}
                </span>
                <FiChevronDown />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-40 p-2 z-50 rounded shadow-lg 
                                border border-gray-200 dark:border-[var(--color-charcoal-700)] 
                                bg-[var(--color-white)] dark:bg-[var(--color-charcoal-800)] 
                                dark:text-white">
                  <NavLink
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--color-charcoal-700)]"
                  >
                    View Profile
                  </NavLink>
                  
                                    <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <li>
          <ThemeToggle />
        </li>
      </ul>

      {/* Mobile Nav Links */}
      {isMobileMenuOpen && (
        <ul
          className="flex flex-col space-y-2 mt-2 md:hidden w-full"
          aria-label="Mobile navigation"
        >
          {/* Mobile Search */}
          <li>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="flex w-full items-center"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search cycles..."
                className="flex-grow px-3 py-2 rounded border text-sm dark:bg-[var(--color-charcoal-700)] dark:text-white"
                aria-label="Search cycles"
              />
              <button
                type="submit"
                className="ml-2 px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </li>

          <li>
            <NavLink
              to="/"
              className="navLink"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className="navLink"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </NavLink>
          </li>

          {!user && (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="navLink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="navLink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}

          {user?.role === "user" && (
            <>
              <li>
                <NavLink
                  to="/cart"
                  className="navLink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart ({cart.length})
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className="navLink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="navLink text-red-600 text-left"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          <li>
            <ThemeToggle />
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;