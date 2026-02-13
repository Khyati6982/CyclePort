import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[var(--color-charcoal-900)] transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className="flex-1 px-4 py-6"
        aria-label="Main content area"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;