import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import CompareButton from "../components/compare/CompareButton";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export function Welcome() {
  const products = useSelector((state) => state.products.products || []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredCycles = useMemo(() => {
    return products.filter((cycle) => cycle.featured);
  }, [products]);

  return (
    <>
      {/* Hero Section */}
      <section
        className="bg-white dark:bg-gray-900 text-center py-10 px-4"
        aria-label="Welcome Hero"
      >
        <h1 className="text-5xl font-bold text-teal-500 dark:text-teal-300">
          Welcome to CyclePort
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
          Your trusted destination for all types of bicycles.
        </p>
      </section>

      {/* Featured Cycles */}
      <section
        className="py-10 px-6 bg-teal-50 dark:bg-gray-800"
        aria-label="Featured Cycles"
      >
        <h2 className="text-2xl font-bold text-teal-500 dark:text-teal-300 text-center mb-8">
          Featured Cycles
        </h2>
        {featuredCycles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCycles.map((cycle) => (
              <div
                key={cycle._id}
                className="min-w-[220px] h-full bg-white dark:bg-gray-900 p-4 rounded shadow hover:shadow-lg hover:scale-[1.01] transition-transform flex flex-col items-center text-center"
              >
                <img
                  src={
                    cycle.image?.startsWith("/uploads")
                      ? `${process.env.REACT_APP_BACKEND_URL}${cycle.image}`
                      : cycle.image
                  }
                  alt={`Image of ${cycle.name}`}
                  className="h-32 w-full object-contain rounded mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {cycle.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{cycle.price.toLocaleString()}
                </p>

                <div className="mt-3 flex flex-col gap-2 w-full">
                  <Link
                    to={`/products/${cycle._id}`}
                    className="btnPrimary w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    aria-label={`View details of ${cycle.name}`}
                  >
                    <FiSearch /> View Details
                  </Link>

                  <CompareButton product={cycle} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            🚲 Featured cycles will appear here soon.
          </p>
        )}
      </section>

      {/* Trust Section */}
      <section
        className="py-10 px-6 bg-white dark:bg-gray-900"
        aria-label="Trust Section"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">
          Why Choose CyclePort?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <TrustItem
            emoji="🏪"
            title="Trusted Local Store"
            desc="Serving Bengaluru cyclists for over a decade."
          />
          <TrustItem
            emoji="🚚"
            title="Fast & Reliable Delivery"
            desc="Doorstep delivery across the city with real-time tracking."
          />
          <TrustItem
            emoji="🔧"
            title="Expert Service & Support"
            desc="Free tune-ups and expert guidance with every purchase."
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section
        className="py-14 px-6 bg-teal-50 dark:bg-gray-800"
        aria-label="Quick Actions"
      >
        <h2 className="text-3xl font-bold text-teal-500 dark:text-teal-300 text-center mb-10">
          Ready to Ride? Let’s Find Your Match
        </h2>
        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <QuickLink
              href="/products"
              title="🚲 Browse Listings"
              desc="Explore our curated collection of cycles, ready to ride."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function TrustItem({ emoji, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}

function QuickLink({ href, title, desc }) {
  return (
    <a
      href={href}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-xl hover:scale-[1.01] transition-transform flex flex-col items-center text-center"
      aria-label={title}
    >
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-base text-gray-500 dark:text-gray-400">{desc}</p>
    </a>
  );
}
