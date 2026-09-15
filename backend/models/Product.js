const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    realityType: {
      type: String,
      enum: ['REAL-WORLD', 'IMMERSIVE', 'FUTURE CONCEPT'],
      default: 'IMMERSIVE'
    },
    duration: {
      type: String,
      default: '1 Day'
    },
    image: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Orbital Station'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
