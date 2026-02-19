const Avatar = ({ src, alt = 'User Avatar', className = '' }) => {
  const fallback = '/images/default-avatar.jpg';

  // Cloudinary URLs are already complete, no need to prepend backend URL
  const validSrc = src && src.trim() !== '' ? src : fallback;

  return (
    <img
      src={validSrc}
      alt={alt}
      className={`rounded-full object-cover border ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
      aria-label={alt}
    />
  );
};

export default Avatar;