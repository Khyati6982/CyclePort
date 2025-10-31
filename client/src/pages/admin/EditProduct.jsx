import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/slices/productSlice';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products) || [];

  const [productData, setProductData] = useState(null);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    countInStock: '',
    image: '',
    featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProductData(data);
      } catch (err) {
        toast.error('Failed to fetch product details.');
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (productData) {
      setForm({
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        countInStock: productData.countInStock,
        image: productData.image,
        featured: productData.featured || false,
      });
      setPreview(productData.image);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: data.imagePath }));
      toast.success('Image uploaded successfully.');
    } catch (err) {
      toast.error('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      toast.error('Please upload an image before submitting.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    };

    setLoading(true);
    try {
      const { data } = await axios.put(`/api/products/${id}`, payload);
      const updatedProducts = products.map((p) =>
        p._id === id ? data.product : p
      );
      dispatch(setProducts(updatedProducts));
      toast.success('Product updated successfully.');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (!productData) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading product details or product not found...
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-4 transition-transform hover:scale-[1.01]"
      aria-label="Edit Product Form"
    >
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">Edit Product</h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full"
        required
      />
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full"
        required
      >
        <option value="">Select Category</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
        <option value="gear">Gear</option>
        <option value="mountain">Mountain</option>
      </select>

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full h-24 resize-none"
        required
      />
      <input
        type="number"
        name="countInStock"
        placeholder="Stock Count"
        value={form.countInStock}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-full"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="accent-teal-500"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Featured</span>
      </label>

      <div className="space-y-2">
        <label htmlFor="imageUpload" className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-block">
          Choose Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {preview && (
          <img
            src={preview.startsWith('/uploads') ? `http://localhost:4000${preview}` : preview}
            alt={`Preview of ${form.name || 'product image'}`}
            className="w-32 h-32 object-cover rounded border"
          />
        )}
        <button
          type="button"
          onClick={handleImageUpload}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full cursor-pointer"
        >
          Upload Image
        </button>
      </div>

      <button type="submit" className="btnPrimary w-full mt-4 cursor-pointer" disabled={loading}>
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
};

export default EditProduct;