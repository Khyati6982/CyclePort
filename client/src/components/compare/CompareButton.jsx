import { useDispatch, useSelector } from 'react-redux'
import { addToCompare, removeFromCompare } from '../../redux/slices/compareSlice'
import { toast } from 'react-toastify'
import { FiRepeat } from 'react-icons/fi'

const CompareButton = ({ product }) => {
  const dispatch = useDispatch()
  const compareList = useSelector((state) => state.compare.items)

  const isCompared = compareList.some((item) => item._id === product._id)

  const handleToggleCompare = () => {
    if (isCompared) {
      dispatch(removeFromCompare(product._id))
      toast.info(`❌ Removed "${product.name}" from compare`)
    } else {
      dispatch(addToCompare(product))
      toast.success(`🔍 Added "${product.name}" to compare`)
    }
  }

  return (
    <button
      onClick={handleToggleCompare}
      className={`btnPrimary w-full flex items-center justify-center gap-2 cursor-pointer ${
        isCompared ? 'bg-red-500 hover:bg-red-600' : ''
      }`}
      aria-label={`${isCompared ? 'Remove' : 'Add'} ${product.name} from compare`}
    >
      <FiRepeat />
      {isCompared ? 'Remove from Compare' : 'Add to Compare'}
    </button>
  )
}

export default CompareButton
