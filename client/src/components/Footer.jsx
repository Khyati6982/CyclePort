const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footerContainer bg-gray-100 dark:bg-[var(--color-charcoal-900)] py-4 mt-10 border-t transition-colors"
      aria-label="Website footer"
    >
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>
          © {currentYear}{" "}
          <span className="font-semibold text-[var(--color-teal-500)]">
            CyclePort
          </span>
          . All rights reserved.
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Built with ❤️ for cycling enthusiasts.
        </p>
      </div>
    </footer>
  );
};

export default Footer;