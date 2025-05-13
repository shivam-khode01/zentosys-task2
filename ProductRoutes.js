// routes/productRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getVendorProducts 
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

// Standard product routes
router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

// Vendor-specific product routes
router.route('/vendor/:vendorId')
  .get(getVendorProducts);

module.exports = router;