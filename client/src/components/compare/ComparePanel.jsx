import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCompare } from "../../redux/slices/compareSlice";
import { toast } from "react-toastify";

const ComparePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareList = useSelector((state) => state.compare.items || []);

  if (!Array.isArray(compareList) || compareList.length === 0) return null;

  const handleCompare = () => {
    if (compareList.length < 2) {
      toast.info("Select at least 2 products to compare.");
      return;
    }
    try {
      sessionStorage.setItem("compareSnapshot", JSON.stringify(compareList)); // Save snapshot
      dispatch(clearCompare()); // Clear Redux
      navigate("/compare"); // Redirect
    } catch (err) {
      toast.error("Failed to prepare comparison.");
    }
  };

  const handleCancel = () => {
    dispatch(clearCompare()); // Manual cancel
    toast.info("Comparison cancelled.");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[var(--color-teal-100)] dark:bg-[var(--color-charcoal-700)] p-4 rounded-lg shadow-lg z-50 w-[300px] transition-transform hover:scale-[1.01]">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
        Selected for Comparison:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 mb-4">
        {compareList.map((item) => (
          <li key={item._id}>{item.name || "Unnamed Product"}</li>
        ))}
      </ul>
      {compareList.length < 2 && (
        <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-2">
          Select at least 2 cycles to compare.
        </p>
      )}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCompare}
          className="btnPrimary w-full cursor-pointer disabled:opacity-50"
          disabled={compareList.length < 2}
          aria-label="Compare selected models"
        >
          Compare Models
        </button>
        <button
          onClick={handleCancel}
          className="btnSecondary w-full cursor-pointer"
          aria-label="Cancel comparison"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComparePanel;
