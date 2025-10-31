import Product from '../models/Product.js';
import slugify from 'slugify';

// GET /api/products/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

// GET /api/products/price-range
export const getPriceRange = async (req, res) => {
  try {
    const prices = await Product.find().select('price');
    const priceValues = prices.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    res.json({ minPrice, maxPrice });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch price range.' });
  }
};

// GET /api/products
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, name } = req.query;
    const query = {};

    if (name?.trim()) {
      query.name = { $regex: name.trim(), $options: 'i' };
    }

    if (category?.trim()) {
      const categories = category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (!isNaN(min) || !isNaN(max)) {
      query.price = {};
      if (!isNaN(min)) query.price.$gte = min;
      if (!isNaN(max)) query.price.$lte = max;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch filtered products.' });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      brand,
      countInStock,
      featured,
      specs,
    } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category, brand.' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    if (countInStock !== undefined && (typeof countInStock !== 'number' || countInStock < 0)) {
      return res.status(400).json({ message: 'countInStock must be a non-negative number.' });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'A product with this name already exists.' });
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      image,
      category,
      price,
      brand,
      countInStock: countInStock ?? 0,
      featured: Boolean(featured),
      specs,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product.' });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      brand,
      countInStock,
      featured,
      specs,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (image) product.image = image;
    if (category) product.category = category;
    if (price !== undefined && typeof price === 'number' && price > 0) product.price = price;
    if (brand) product.brand = brand;
    if (countInStock !== undefined && typeof countInStock === 'number' && countInStock >= 0) {
      product.countInStock = countInStock;
    }
    if (typeof featured === 'boolean') product.featured = featured;
    if (specs) product.specs = specs;

    const updatedProduct = await product.save();
    res.json({ product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
};

// POST /api/products/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === userId.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const review = {
      user: userId,
      name: userName,
      rating,
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    await product.save();
    res.status(201).json({ message: 'Review added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review.' });
  }
};

// PUT /api/products/:id/reviews/:reviewId
export const updateProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only edit your own review.' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.updatedAt = new Date();

    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.json({ message: 'Review updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review.' });
  }
};

// DELETE /api/products/:id/reviews/:reviewId
export const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own review.' });
    }

    // Replace .remove() with array filtering
    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;
    product.rating =
      product.numReviews > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews
        : 0;

    await product.save();
    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};


// GET /api/products/compare/specs?ids=abc123,def456
export const getCompareSpecs = async (req, res) => {
  try {
    const ids = req.query.ids?.split(',').map(id => id.trim());

    if (!ids || ids.length < 2) {
      return res.status(400).json({ message: 'Please provide at least two product IDs to compare.' });
    }

    const products = await Product.find({ _id: { $in: ids } }).select('name image brand specs');

    if (products.length !== ids.length) {
      return res.status(404).json({ message: 'One or more products not found.' });
    }

    const compareData = products.map(p => ({
      id: p._id,
      name: p.name,
      image: p.image,
      brand: p.brand,
      specs: p.specs,
    }));

    res.json(compareData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comparison specs.' });
  }
};