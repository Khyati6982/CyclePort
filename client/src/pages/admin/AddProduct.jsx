import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/slices/productSlice";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    countInStock: "",
    image: "",
    featured: false,
    specs: {
      frame: "",
      wheels: "",
      weight: "",
      terrain: "",
      electric: false,
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products) || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: name === "electric" ? value === "true" : value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please choose an image before submitting.");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("name", form.name);
    formDataUpload.append("brand", form.brand);
    formDataUpload.append("category", form.category);
    formDataUpload.append("price", form.price);
    formDataUpload.append("description", form.description);
    formDataUpload.append("countInStock", form.countInStock);
    formDataUpload.append("featured", form.featured);
    formDataUpload.append("specs", JSON.stringify(form.specs));
    formDataUpload.append("image", imageFile); // Cloudinary upload

    setLoading(true);
    try {
      const { data } = await axios.post("/api/products", formDataUpload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(setProducts([...products, data.product]));
      toast.success(`Product "${data.product.name}" added successfully.`);
      navigate("/admin/products");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to add product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">
        Add New Product
      </h2>

      {/* Basic Fields */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        required
      />

      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded cursor-pointer bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
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
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        required
        min="1"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded resize-none h-24 bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        required
      />

      <input
        type="number"
        name="countInStock"
        placeholder="Stock Count"
        value={form.countInStock}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        required
        min="0"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="h-4 w-4 text-teal-600 border-gray-300 rounded 
                     focus:ring-teal-500 dark:bg-gray-900 dark:border-gray-700"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Mark as Featured
        </span>
      </label>

      {/* Specs Section */}
      <h3 className="text-lg font-semibold mt-6">Specifications</h3>

      <input
        type="text"
        name="frame"
        placeholder="Frame"
        value={form.specs.frame}
        onChange={handleSpecsChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <input
        type="text"
        name="wheels"
        placeholder="Wheels"
        value={form.specs.wheels}
        onChange={handleSpecsChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <input
        type="text"
        name="weight"
        placeholder="Weight"
        value={form.specs.weight}
        onChange={handleSpecsChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <input
        type="text"
        name="terrain"
        placeholder="Terrain"
        value={form.specs.terrain}
        onChange={handleSpecsChange}
        className="w-full px-3 py-2 border rounded bg-white text-gray-900 
                   dark:bg-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />

      <label className="block">
        Electric
        <select
          name="electric"
          value={form.specs.electric}
          onChange={handleSpecsChange}
          className="w-full px-3 py-2 border rounded cursor-pointer mt-1 bg-white text-gray-900 
                     dark:bg-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label
          htmlFor="imageUpload"
          className="cursor-pointer bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 inline-block"
        >
          Choose Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
        {preview && (
          <img
            src={preview}
            alt={`Preview of ${form.name || "product image"}`}
            className="w-32 h-32 object-cover rounded border"
          />
        )}
      </div>

      {/* Submit & Cancel */}
      <button
        type="submit"
        className="w-full px-4 py-2 rounded transition-colors bg-teal-500 text-white hover:bg-teal-600 cursor-pointer mt-4"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="w-full px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 cursor-pointer mt-2"
      >
        Cancel Product
      </button>
    </form>
  );
};

export default AddProduct;