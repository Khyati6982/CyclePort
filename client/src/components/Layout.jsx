import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[var(--color-charcoal-900)] px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;