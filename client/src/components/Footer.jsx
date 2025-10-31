const Footer = () => {
  return (
    <footer className="footerContainer bg-gray-100 dark:bg-[var(--color-charcoal-900)] py-4 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-white">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[var(--color-teal-500)]">CyclePort</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer