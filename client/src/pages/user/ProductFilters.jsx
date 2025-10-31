import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProducts } from '../../redux/slices/productSlice'
import axios from '../../utils/axios'
import { toast } from 'react-toastify'
import { FiFilter } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'

const ProductFilters = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [maxPrice, setMaxPrice] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryQuery = params.get('category')
    const maxPriceQuery = params.get('maxPrice')

    if (categoryQuery) {
      setSelectedCategories(categoryQuery.split(','))
    }
    if (maxPriceQuery) {
      setMaxPrice(Number(maxPriceQuery))
    }
  }, [location.search])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories')
        setCategories(data)
      } catch (err) {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const { data } = await axios.get('/api/products/price-range')
        setPriceRange({ min: data.minPrice, max: data.maxPrice })

        // Start pointer at left end, but preserve full range
        setMaxPrice(data.maxPrice)
      } catch (err) {
        toast.error('Failed to load price range')
      }
    }
    fetchPriceRange()
  }, [])

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target
    if (value === 'all') {
      setSelectedCategories([])
    } else {
      setSelectedCategories((prev) =>
        checked ? [...new Set([...prev, value])] : prev.filter((cat) => cat !== value)
      )
    }
  }

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : '',
    }

    if (priceRange.min !== priceRange.max && maxPrice !== priceRange.min) {
      filters.minPrice = priceRange.min
      filters.maxPrice = maxPrice
    }

    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    navigate(`/products?${params.toString()}`)

    dispatch(fetchProducts(filters))
  }

  const isAllSelected = selectedCategories.length === 0

  return (
    <div
      className="space-y-6 p-4 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow transition-transform hover:scale-[1.01]"
      aria-label="Product Filters"
    >
      <h3 className="text-lg font-bold text-[var(--color-teal-500)] flex items-center gap-2">
        <FiFilter /> Filter Products
      </h3>

      {/* Category Checkboxes */}
      <div className="space-y-2">
        <p className="font-semibold">Category</p>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="all"
            checked={isAllSelected}
            onChange={handleCategoryChange}
            className="accent-[var(--color-teal-500)]"
          />
          All
        </label>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={handleCategoryChange}
                className="accent-[var(--color-teal-500)]"
                aria-label={`Filter by ${cat}`}
              />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))
        )}
      </div>

      {/* Price Slider */}
      <div className="space-y-2">
        <p className="font-semibold">Max Price</p>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>₹{priceRange.min}</span>
          <span>₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          disabled={priceRange.min === priceRange.max}
          className="w-full accent-[var(--color-teal-500)] disabled:opacity-50"
          aria-label="Maximum price"
        />
        {priceRange.min === priceRange.max && (
          <p className="text-sm text-gray-500 italic">
            All products are priced at ₹{priceRange.min}. Price filtering is disabled.
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-[var(--color-teal-500)] text-white rounded hover:bg-[var(--color-teal-300)] transition cursor-pointer"
        >
          Apply Filters
        </button>

        <button
          onClick={() => {
            setSelectedCategories([])
            setMaxPrice(priceRange.max) // Reset to full range
            navigate('/products')
            dispatch(fetchProducts({}))
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default React.memo(ProductFilters)