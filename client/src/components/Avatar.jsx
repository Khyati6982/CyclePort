const Avatar = ({ src, alt = 'User Avatar', className = '' }) => {
  const fallback = '/images/default-avatar.png'

  // If src starts with /uploads, prepend backend URL
  const resolvedSrc = src?.startsWith('/uploads')
    ? `http://localhost:4000${src}`
    : src

  const validSrc = resolvedSrc && resolvedSrc.trim() !== '' ? resolvedSrc : fallback

  return (
    <img
      src={validSrc}
      alt={alt}
      className={`rounded-full object-cover border ${className}`}
      onError={(e) => {
        e.target.onerror = null
        e.target.src = fallback
      }}
    />
  )
}

export default Avatar