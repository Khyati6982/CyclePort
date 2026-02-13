import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ComparePage = () => {
  const [cycles, setCycles] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const stored = sessionStorage.getItem("compareSnapshot");
    if (stored) {
      setCycles(JSON.parse(stored));
      sessionStorage.removeItem("compareSnapshot");
    }
  }, []);

  // Keep sessionStorage in sync when cycles change
  useEffect(() => {
    if (cycles.length > 0) {
      sessionStorage.setItem("compareSnapshot", JSON.stringify(cycles));
    } else {
      sessionStorage.removeItem("compareSnapshot");
    }
  }, [cycles]);

  const handleRemove = (id) => {
    const updated = cycles.filter((cycle) => cycle._id !== id);
    setCycles(updated);
  };

  if (!cycles || cycles.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
        <p>No cycles selected for comparison.</p>
        <button
          onClick={() => navigate("/products")}
          className="btnPrimary mt-4 cursor-pointer"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-[var(--color-teal-500)] mb-4">
        Comparing {cycles.length} Cycle{cycles.length > 1 ? "s" : ""}
      </h2>

      {cycles.length === 1 && (
        <p className="text-sm text-[var(--color-teal-500)] italic mb-4">
          Select one more cycle to compare meaningfully.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cycles.map((cycle) => (
          <div
            key={cycle._id}
            className="border rounded-lg p-4 shadow bg-white dark:bg-[var(--color-charcoal-800)]"
          >
            <img
              src={
                cycle.image?.startsWith("/uploads")
                ? `${import.meta.env.VITE_API_URL || ""}${cycle.image}`
                : cycle.image
              }
              alt={`Image of ${cycle.name}`}
              className="w-full h-48 object-contain rounded mb-3"
            />

            <h3 className="text-lg font-semibold text-[var(--color-teal-500)]">
              {cycle.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
              Category: {cycle.category}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {cycle.description}
            </p>
            <p className="text-md font-bold text-gray-800 dark:text-white">
              {formatPrice(cycle.price)}
            </p>

            {/* Specs block */}
            {cycle.specs ? (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Specifications:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                  {Object.entries(cycle.specs).map(([key, value]) => {
                    if (key === "electric") {
                      if (value === undefined || value === null) return null;

                      const displayValue =
                        typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : value;

                      return (
                        <li key={key}>
                          <span className="capitalize">{key}:</span>{" "}
                          {displayValue}
                        </li>
                      );
                    }

                    return (
                      <li key={key}>
                        <span className="capitalize">{key}:</span> {value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">
                Specifications not available
              </p>
            )}

            <button
              onClick={() => handleRemove(cycle._id)}
              className="text-sm text-[var(--color-teal-500)] hover:underline mt-2 cursor-pointer"
              aria-label={`Remove ${cycle.name} from comparison`}
            >
              Remove from Compare
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;