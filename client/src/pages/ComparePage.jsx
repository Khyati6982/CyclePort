import { useEffect, useState } from "react";

const ComparePage = () => {
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("compareSnapshot");
    if (stored) {
      setCycles(JSON.parse(stored));
      sessionStorage.removeItem("compareSnapshot");
    }
  }, []);

  const handleRemove = (id) => {
    const updated = cycles.filter((cycle) => cycle._id !== id);
    setCycles(updated);
  };

  if (!cycles || cycles.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
        No cycles selected for comparison.
      </div>
    );
  }

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
              src={cycle.image}
              alt={cycle.name}
              className="w-full h-48 object-contain rounded mb-3"
            />
            <h3 className="text-lg font-semibold text-[var(--color-teal-500)]">{cycle.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
              Category: {cycle.category}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {cycle.description}
            </p>
            <p className="text-md font-bold text-gray-800 dark:text-white">
              ₹{cycle.price}
            </p>
            <button
              onClick={() => handleRemove(cycle._id)}
              className="text-sm text-[var(--color-teal-500)] hover:underline mt-2 cursor-pointer"
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