import { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment,
      });

      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      onReviewAdded(data); // optional callback
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Leave a Review</h3>

      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r} Stars</option>
        ))}
      </select>

      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts..."
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;