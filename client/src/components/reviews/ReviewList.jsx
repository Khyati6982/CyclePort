import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewList = ({ reviews = [] }) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-600 dark:text-gray-300 italic">
        🗨️ No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="review-list mt-10">
      <h3 className="text-xl font-bold text-[var(--color-teal-500)] mb-4">
        Customer Reviews
      </h3>

      {reviews.map((review) => {
        const wasEdited = review.updatedAt && review.updatedAt !== review.createdAt;
        return (
          <div
            key={review._id || Math.random()}
            className="review-card p-4 border rounded shadow mb-4 bg-white dark:bg-[var(--color-charcoal-800)] transition-transform hover:scale-[1.01]"
            aria-label={`Review by ${review.user?.name || 'Anonymous'}`}
          >
            <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-300">
              <strong>{review.user?.name || 'Anonymous'}</strong>
              <span>
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {wasEdited && ' (edited)'}
              </span>
            </div>

            <div className="flex mb-2 text-yellow-500">
              {[...Array(review.rating || 0)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p className="text-gray-800 dark:text-white text-sm">
              {review.comment || 'No comment provided.'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;