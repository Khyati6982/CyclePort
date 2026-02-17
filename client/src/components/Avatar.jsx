const Avatar = ({ src, alt = 'User Avatar', className = '' }) => {
  const fallback = '/images/default-avatar.png';

  // If src starts with /uploads, prepend backend URL from env
  const resolvedSrc = src?.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL || ''}${src}`
    : src;

  const validSrc = resolvedSrc && resolvedSrc.trim() !== '' ? resolvedSrc : fallback;

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