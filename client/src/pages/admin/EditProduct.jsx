import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/slices/productSlice";
import axios from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
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

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price || 0,
        description: selectedProduct.description || "",
        image: selectedProduct.image || "",
        featured: selectedProduct.featured || false,
        specs: {
          frame: selectedProduct.specs?.frame || "",
          wheels: selectedProduct.specs?.wheels || "",
          weight: selectedProduct.specs?.weight || "",
          terrain: selectedProduct.specs?.terrain || "",
          electric: selectedProduct.specs?.electric || false,
        },
      });

      if (selectedProduct.image?.startsWith("/uploads")) {
        setPreview(`${import.meta.env.VITE_API_URL}${selectedProduct.image}`);
      } else {
        setPreview(selectedProduct.image || "");
      }
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please choose an image first.");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("image", imageFile);

    try {
      const { data } = await axios.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, image: data.imagePath });
      setPreview(`${import.meta.env.VITE_API_URL}${data.imagePath}`);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image.");
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setPreview("");
    setImageFile(null);
    toast.info("Image removed. You can upload a new one.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        specs: {
          ...formData.specs,
          electric:
            formData.specs.electric === true ||
            formData.specs.electric === "true",
        },
      };
      const { data } = await axios.put(`/api/products/${id}`, payload);

      toast.success(`Product "${data.product.name}" updated successfully!`);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product.");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">
        Edit Product
      </h2>

      {/* Basic Fields */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="formField"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="formSelect"
        required
      >
        <option value="">Select Category</option>
        {["men", "women", "kids", "gear", "mountain"].map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="formField"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="formTextarea h-24"
      />

      {/* Specs Section */}
      <h3 className="text-lg font-semibold mt-6">Specifications</h3>

      <div className="space-y-3">
        <label className="block">
          Frame
          <input
            type="text"
            name="frame"
            placeholder="Frame"
            value={formData.specs.frame}
            onChange={handleSpecsChange}
            className="formField mt-1"
          />
        </label>

        <label className="block">
          Wheels
          <input
            type="text"
            name="wheels"
            placeholder="Wheels"
            value={formData.specs.wheels}
            onChange={handleSpecsChange}
            className="formField mt-1"
          />
        </label>

        <label className="block">
          Weight
          <input
            type="text"
            name="weight"
            placeholder="Weight"
            value={formData.specs.weight}
            onChange={handleSpecsChange}
            className="formField mt-1"
          />
        </label>

        <label className="block">
          Terrain
          <input
            type="text"
            name="terrain"
            placeholder="Terrain"
            value={formData.specs.terrain}
            onChange={handleSpecsChange}
            className="formField mt-1"
          />
        </label>

        <label className="block">
          Electric
          <select
            name="electric"
            value={formData.specs.electric}
            onChange={handleSpecsChange}
            className="formSelect mt-1"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
      </div>

      {/* Featured Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="formCheckbox"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Mark as Featured
        </span>
      </label>

            {/* Image Upload Section */}
      {preview ? (
        <div className="flex flex-col items-start">
          <img
            src={preview}
            alt="Product"
            className="w-40 h-40 object-contain mb-2 border rounded"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="formField"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full"
          >
            Upload Image
          </button>
        </div>
      )}

      {/* Submit & Cancel */}
      <button type="submit" className="btnPrimary w-full mt-4">
        Save Changes
      </button>

      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full mt-2 cursor-pointer"
      >
        Cancel Changes
      </button>
    </form>
  );
};

export default EditProduct;