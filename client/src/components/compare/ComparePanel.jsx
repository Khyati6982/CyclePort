import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCompare } from "../../redux/slices/compareSlice";

const ComparePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareList = useSelector((state) => state.compare.items);

  if (!compareList || compareList.length === 0) return null;

  const handleCompare = () => {
    sessionStorage.setItem("compareSnapshot", JSON.stringify(compareList)); // Save snapshot
    dispatch(clearCompare()); // Clear Redux
    navigate("/compare");     // Redirect
  };

  const handleCancel = () => {
    dispatch(clearCompare()); // Manual cancel
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[var(--color-teal-100)] dark:bg-[var(--color-charcoal-700)] p-4 rounded-lg shadow-lg z-50 w-[300px]">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
        Selected for Comparison:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 mb-4">
        {compareList.map((item) => (
          <li key={item._id}>{item.name}</li>
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
          className="btnPrimary w-full cursor-pointer"
          disabled={compareList.length < 2}
        >
          Compare Models
        </button>
        <button
          onClick={handleCancel}
          className="btnSecondary w-full cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComparePanel;