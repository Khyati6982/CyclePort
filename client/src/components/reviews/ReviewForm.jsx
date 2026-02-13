import { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, {
        rating: Number(rating),
        comment,
      });

      toast.success('Review submitted!');
      setComment('');
      setRating(5);

      if (typeof onReviewAdded === "function") {
        onReviewAdded(data); // optional callback
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow"
      aria-label="Review Form"
    >
      <h3 className="text-lg font-bold text-[var(--color-teal-500)]">Leave a Review</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rating:
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 rounded border bg-white text-gray-800 dark:bg-[var(--color-charcoal-700)] dark:text-white"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
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
          required
          className="w-full p-2 rounded border bg-white text-gray-800 dark:bg-[var(--color-charcoal-800)] dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btnPrimary w-full flex items-center justify-center gap-2 cursor-pointer ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Submit review"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;