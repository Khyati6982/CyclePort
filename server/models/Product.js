import mongoose from 'mongoose'

// Review schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'gear', 'mountain'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  brand: {
    type: String,
    default: 'Generic',
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  reviews: [reviewSchema],
  specs: {
    frame: { type: String, default: '' },  
    wheels: { type: String, default: '' },
    weight: { type: String, default: '' },
    terrain: { type: String, default: '' },
    electric: { type: Boolean, default: false },
  },
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product
