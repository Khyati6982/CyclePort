import Product from '../models/Product.js'
import slugify from 'slugify'

// GET /api/products/featured
export const getFeaturedProducts = async (req, res, next) => {
  try {
    // Find products where featured = true
    const products = await Product.find({ featured: true });

    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category')
    res.status(200).json({ categories })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/price-range
export const getPriceRange = async (req, res, next) => {
  try {
    const prices = await Product.find().select('price')
    const priceValues = prices.map(p => p.price)
    const minPrice = Math.min(...priceValues)
    const maxPrice = Math.max(...priceValues)
    res.status(200).json({ minPrice, maxPrice })
  } catch (err) {
    next(err)
  }
}

// GET /api/products
export const getFilteredProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, name } = req.query
    const query = {}

    if (name?.trim()) {
      query.name = { $regex: name.trim(), $options: 'i' }
    }

    if (category?.trim()) {
      const categories = category.split(',').map(c => c.trim())
      query.category = { $in: categories }
    }

    const min = Number(minPrice)
    const max = Number(maxPrice)

    if (!isNaN(min) || !isNaN(max)) {
      query.price = {}
      if (!isNaN(min)) query.price.$gte = min
      if (!isNaN(max)) query.price.$lte = max
    }

    const products = await Product.find(query)
    res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      const error = new Error('Product not found.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
}

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, brand, countInStock, featured, specs } = req.body;

    if (!name || !price || !category || !brand) {
      const error = new Error('Missing required fields: name, price, category, brand.');
      error.statusCode = 400;
      throw error;
    }

    if (typeof price !== 'number' || price <= 0) {
      const error = new Error('Price must be a positive number.');
      error.statusCode = 400;
      throw error;
    }

    if (countInStock !== undefined && (typeof countInStock !== 'number' || countInStock < 0)) {
      const error = new Error('countInStock must be a non-negative number.');
      error.statusCode = 400;
      throw error;
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Product.findOne({ slug });
    if (existing) {
      const error = new Error('A product with this name already exists.');
      error.statusCode = 409;
      throw error;
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      image: req.file ? req.file.path : req.body.image, // Cloudinary URL if uploaded
      category,
      price,
      brand,
      countInStock: countInStock ?? 0,
      featured: Boolean(featured),
      specs,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ product: savedProduct });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, brand, countInStock, featured, specs } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (req.file) {
      product.image = req.file.path; // Cloudinary URL if new file uploaded
    } else if (req.body.image) {
      product.image = req.body.image; // fallback if image passed manually
    }
    if (category) product.category = category;
    if (price !== undefined && typeof price === 'number' && price > 0) product.price = price;
    if (brand) product.brand = brand;
    if (countInStock !== undefined && typeof countInStock === 'number' && countInStock >= 0) {
      product.countInStock = countInStock;
    }
    if (typeof featured === 'boolean') product.featured = featured;
    if (specs) product.specs = specs;

    const updatedProduct = await product.save();
    res.status(200).json({ product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:id/reviews
export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const productId = req.params.id
    const userId = req.user._id
    const userName = req.user.name

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      const error = new Error('Rating must be a number between 1 and 5.')
      error.statusCode = 400
      throw error
    }

    const product = await Product.findById(productId)
    if (!product) {
      const error = new Error('Product not found.')
      error.statusCode = 404
      throw error
    }

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === userId.toString())
    if (alreadyReviewed) {
      const error = new Error('You have already reviewed this product.')
      error.statusCode = 400
      throw error
    }

    const review = { user: userId, name: userName, rating, comment }
    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews

    await product.save()
    res.status(201).json({ message: 'Review added successfully.' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/products/:id/reviews/:reviewId
export const updateProductReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params
    const { rating, comment } = req.body
    const userId = req.user._id

    const product = await Product.findById(id)
    if (!product) {
      const error = new Error('Product not found.')
      error.statusCode = 404
      throw error
    }

    const review = product.reviews.id(reviewId)
    if (!review) {
      const error = new Error('Review not found.')
      error.statusCode = 404
      throw error
    }

    if (review.user.toString() !== userId.toString()) {
      const error = new Error('You can only edit your own review.')
      error.statusCode = 403
      throw error
    }

    if (rating) review.rating = rating
    if (comment) review.comment = comment
    review.updatedAt = new Date()

    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

    await product.save()
    res.status(200).json({ message: 'Review updated successfully.' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/products/:id/reviews/:reviewId
export const deleteProductReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params
    const userId = req.user._id

    const product = await Product.findById(id)
    if (!product) {
      const error = new Error('Product not found.')
      error.statusCode = 404
      throw error
    }

    const review = product.reviews.id(reviewId)
    if (!review) {
      const error = new Error('Review not found.')
      error.statusCode = 404
      throw error
    }

    if (review.user.toString() !== userId.toString()) {
      const error = new Error('You can only delete your own review.')
      error.statusCode = 403
      throw error
    }

    // Remove review safely
    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId)
    product.numReviews = product.reviews.length
    product.rating =
      product.numReviews > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews
        : 0

    await product.save()
    res.status(200).json({ message: 'Review deleted successfully.' })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/compare/specs?ids=abc123,def456
export const getCompareSpecs = async (req, res, next) => {
  try {
    const ids = req.query.ids?.split(',').map(id => id.trim())

    if (!ids || ids.length < 2) {
      const error = new Error('Please provide at least two product IDs to compare.')
      error.statusCode = 400
      throw error
    }

    const products = await Product.find({ _id: { $in: ids } }).select('name image brand specs')

    if (products.length !== ids.length) {
      const error = new Error('One or more products not found.')
      error.statusCode = 404
      throw error
    }

    const compareData = products.map(p => ({
      id: p._id,
      name: p.name,
      image: p.image,
      brand: p.brand,
      specs: p.specs,
    }))

    res.status(200).json({ compareData })
  } catch (err) {
    next(err)
  }
}