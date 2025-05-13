// models/Cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  name: String,
  image: String
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total whenever cart items change
CartSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    this.total = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Cart', CartSchema);