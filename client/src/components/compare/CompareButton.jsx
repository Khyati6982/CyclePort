import { useDispatch, useSelector } from 'react-redux';
import { addToCompare, removeFromCompare } from '../../redux/slices/compareSlice';
import { toast } from 'react-toastify';
import { FiRepeat } from 'react-icons/fi';

const CompareButton = ({ product }) => {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.compare.items || []);

  const isCompared = compareList.some((item) => item._id === product._id);

  const handleToggleCompare = () => {
    if (!product?._id) {
      toast.error('Invalid product. Cannot compare.');
      return;
    }

    if (isCompared) {
      dispatch(removeFromCompare(product._id));
      toast.info(`❌ Removed "${product.name || 'Product'}" from compare`);
    } else {
      dispatch(addToCompare(product));
      toast.success(`🔍 Added "${product.name || 'Product'}" to compare`);
    }
  };

  return (
    <button
      onClick={handleToggleCompare}
      className={`btnPrimary w-full flex items-center justify-center gap-2 cursor-pointer transition ${
        isCompared ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)]'
      }`}
      aria-label={`${isCompared ? 'Remove' : 'Add'} ${product?.name || 'product'} from compare`}
    >
      <FiRepeat />
      {isCompared ? 'Remove from Compare' : 'Add to Compare'}
    </button>
  );
};

export default CompareButton;