import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/slices/cartSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import ProductFilters from "./ProductFilters";
import CompareButton from "../../components/compare/CompareButton";

const UserProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }

    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      toast.info(`${product.name} is already in your cart.`);
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading products...</p>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-[var(--color-charcoal-700)]">
          Failed to load products.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar Filter */}
      <div className="md:w-1/4">
        <ProductFilters />
      </div>

      {/* Product Grid or Empty State */}
      <div className="md:w-3/4">
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
              No products match your filters.
            </p>
            <button
              onClick={() => dispatch(fetchProducts({}))}
              className="px-4 py-2 bg-[var(--color-teal-500)] text-white rounded hover:bg-[var(--color-teal-300)] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const imagePath = product.image?.startsWith("/uploads")
                ? `http://localhost:4000${product.image}`
                : product.image;

              return (
                <div
                  key={product._id}
                  className="border rounded shadow p-4 bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] transition-transform hover:scale-[1.01]"
                  aria-label={`Product: ${product.name}`}
                >
                  <img
                    src={imagePath}
                    alt={`Image of ${product.name}`}
                    className="w-full h-40 object-contain rounded mb-4 bg-white"
                  />
                  <h3 className="text-lg font-bold text-[var(--color-teal-500)]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </p>
                  <p className="text-md font-semibold mt-2">₹{product.price}</p>

                  {product.countInStock === 0 && (
                    <p className="text-sm text-red-500 font-semibold mt-1">
                      Out of Stock
                    </p>
                  )}

                  <Link
                    to={`/products/${product._id}`}
                    className="btnPrimary w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    aria-label={`View details of ${product.name}`}
                  >
                    <FiSearch /> View Details
                  </Link>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.countInStock === 0}
                    className={`btnPrimary w-full mt-4 flex items-center justify-center gap-2 cursor-pointer ${
                      product.countInStock === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>

                  {/* Compare Button */}
                  <div className="mt-4">
                    <CompareButton product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProductList;
