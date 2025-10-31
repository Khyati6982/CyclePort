import React from 'react'
import { FaStar } from 'react-icons/fa'

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-600 dark:text-white">
        No reviews yet. Be the first to share your thoughts!
      </p>
    )
  }

  return (
    <div className="review-list mt-10">
      <h3 className="text-xl font-bold text-[var(--color-teal-500)] mb-4">
        Customer Reviews
      </h3>

      {reviews.map((review) => (
        <div
          key={review._id}
          className="review-card p-4 border rounded shadow mb-4 bg-white dark:bg-[var(--color-charcoal-800)]"
        >
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-white">
            <strong>{review.user?.name || 'Anonymous'}</strong>
            <span>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex mb-2">
            {[...Array(review.rating)].map((_, i) => (
              <FaStar key={i} color="#f5c518" />
            ))}
          </div>

          <p className="text-gray-800 dark:text-white text-sm">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ReviewList