import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleProduct } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { FiShoppingCart, FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.items);

  const [localReviews, setLocalReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.reviews) {
      setLocalReviews(selectedProduct.reviews);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    const exists = cart.find((item) => item._id === selectedProduct._id);
    if (exists) {
      toast.info(`${selectedProduct.name} is already in your cart.`);
      return;
    }

    dispatch(addToCart(selectedProduct));
    toast.success(`${selectedProduct.name} added to cart.`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      if (editingReviewId) {
        await axios.put(`/api/products/${id}/reviews/${editingReviewId}`, {
          rating,
          comment,
        });
        toast.success("Review updated!");
        setEditingReviewId(null);
      } else {
        await axios.post(`/api/products/${id}/reviews`, { rating, comment });
        toast.success("Review submitted!");
      }

      dispatch(fetchSingleProduct(id));
      setRating(5);
      setComment("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Not authorized. Please log in again.",
      );
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/api/products/${id}/reviews/${reviewId}`);
      toast.success("Review deleted!");
      dispatch(fetchSingleProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading product...</p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!selectedProduct) return null;

  const { name, description, price, image, category, countInStock } =
    selectedProduct;
  const imagePath = image?.startsWith("/uploads")
    ? `${import.meta.env.VITE_API_URL || ""}${image}`
    : image;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow transition-transform hover:scale-[1.01]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={imagePath}
          alt={`Image of ${name || "product"}`}
          className="w-full h-40 object-contain rounded shadow"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">
            {name || "Unnamed Product"}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {description || "No description available."}
          </p>
          <p className="text-lg font-semibold text-[var(--color-charcoal-700)] dark:text-white">
            Category:{" "}
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "Uncategorized"}
          </p>
          <p className="text-2xl font-bold text-[var(--color-teal-500)]">
            {formatCurrency(price || 0)}
          </p>

          {/* Stock status */}
          {(() => {
            if (countInStock === 0) {
              return (
                <p className="text-sm text-red-500 font-semibold mt-1">
                  Out of Stock
                </p>
              );
            } else if (countInStock === 1) {
              return (
                <p className="text-sm text-red-500 font-semibold mt-1">
                  Only 1 left — last piece!
                </p>
              );
            } else if (countInStock === 2) {
              return (
                <p className="text-sm text-orange-500 font-semibold mt-1">
                  Only 2 left — selling fast!
                </p>
              );
            } else if (countInStock === 3) {
              return (
                <p className="text-sm text-yellow-600 font-semibold mt-1">
                  Only 3 left — order soon!
                </p>
              );
            } else {
              return (
                <p className="text-sm text-gray-500 mt-1">
                  Available: {countInStock} in stock
                </p>
              );
            }
          })()}

          <button
            onClick={handleAddToCart}
            disabled={countInStock === 0}
            className={`px-4 py-2 rounded text-white text-sm font-medium transition ${
              countInStock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] cursor-pointer"
            }`}
            aria-label={`Add ${name} to cart`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiShoppingCart /> Add to Cart
            </div>
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-300 italic mt-2">
            To compare cycles, visit the product list and use the “Add to
            Compare” button.
          </p>
        </div>
      </div>

      {/* Specifications Section */}
      {selectedProduct.specs && (
        <div className="mt-8 bg-gray-50 dark:bg-[var(--color-charcoal-700)] p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-[var(--color-teal-500)] mb-4">
            Specifications
          </h3>
          {Array.isArray(selectedProduct.specs) ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {selectedProduct.specs.map((spec, idx) => (
                <li key={idx}>{spec}</li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {Object.entries(selectedProduct.specs).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : value || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12 space-y-6 bg-gray-50 dark:bg-[var(--color-charcoal-700)] p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-[var(--color-teal-500)] mb-4">
          Customer Reviews
        </h3>

        {!user ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            Please log in to leave a review.
          </p>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating:
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 rounded border bg-white text-gray-800 dark:bg-[var(--color-charcoal-700)] dark:text-white"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full p-2 rounded border bg-white text-gray-800 dark:bg-[var(--color-charcoal-800)] dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-[var(--color-teal-500)] text-white px-4 py-2 rounded hover:bg-[var(--color-teal-600)] cursor-pointer"
            >
              {editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </form>
        )}

        {/* Review List */}
        <div className="mt-6 space-y-4">
          {localReviews.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300 italic">
              🗨️ No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            localReviews.map((review, index) => {
              const isOwnReview = user && review.name === user.name;
              const wasEdited =
                review.updatedAt && review.updatedAt !== review.createdAt;

              return (
                <div
                  key={index}
                  className="relative p-4 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow"
                >
                  {isOwnReview && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-600 hover:text-blue-800 dark:text-teal-300 dark:hover:text-teal-400 flex items-center gap-1 hover:underline cursor-pointer"
                        title="Edit your review"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 hover:underline cursor-pointer"
                        title="Delete your review"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>

                  <p className="text-gray-800 dark:text-white">
                    {review.comment}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {review.name} •{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {wasEdited && " (edited)"}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
