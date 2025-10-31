import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setProducts } from '../../redux/slices/productSlice';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      const updated = products.filter((p) => p._id !== id);
      dispatch(setProducts(updated));
      toast.success('Product deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleAdd = () => {
    navigate('/admin/add-product');
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading products...</p>;
  if (error) {
    toast.error(error);
    return <p className="text-center mt-10 text-red-500">Error loading products.</p>;
  }

  if (!Array.isArray(products)) {
    return <p className="text-center mt-10 text-gray-500">No product data available.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">Admin Product List</h2>
        <button onClick={handleAdd} className="btnPrimary flex items-center gap-2">
          <FiPlus /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-[var(--color-charcoal-700)]">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded p-4 shadow bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] transition-transform hover:scale-[1.01]"
              aria-label={`Product ${product.name}`}
            >
              <img
                src={
                  product?.image?.startsWith('/uploads')
                    ? `http://localhost:4000${product.image}`
                    : product?.image || '/placeholder.jpg'
                }
                alt={product.name}
                className="w-full h-40 object-contain rounded mb-4"
              />
              <h3 className="text-lg font-bold text-[var(--color-teal-500)]">{product.name}</h3>
              <p className="text-sm text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </p>
              <p className="text-md font-semibold mt-2">₹{product.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="btnSecondary flex items-center gap-1 cursor-pointer"
                  aria-label={`Edit ${product.name}`}
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                  aria-label={`Delete ${product.name}`}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
