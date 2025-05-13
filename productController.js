// controllers/productController.js
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Implement pagination, filtering, sorting, etc.
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();
  
  // Build query based on filters
  let query = {};
  
  // Filter by category if provided
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by price range if provided
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }
  
  // Search by name or description if search term provided
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  
  // Execute query with pagination
  const products = await Product.find(query)
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-createdAt');
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'vendorId',
    select: 'name email'
  });
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendors and Admins only)
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add user to req.body as vendorId
  req.body.vendorId = req.user.id;
  
  // Check if user is vendor or admin
  const user = await User.findById(req.user.id);
  
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return next(new ErrorResponse(`User with ID ${req.user.id} is not authorized to create products`, 403));
  }
  
  const product = await Product.create(req.body);
  
  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner Vendor or Admin only)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is product owner or admin
  if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User with ID ${req.user.id} is not authorized to update this product`, 403));
  }
  
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner Vendor or Admin only)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is product owner or admin
  if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User with ID ${req.user.id} is not authorized to delete this product`, 403));
  }
  
  await product.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get products by vendor
// @route   GET /api/vendors/:vendorId/products
// @access  Public
exports.getVendorProducts = asyncHandler(async (req, res, next) => {
  const vendorId = req.params.vendorId;
  
  // Check if vendor exists
  const vendor = await User.findById(vendorId);
  
  if (!vendor || vendor.role !== 'vendor') {
    return next(new ErrorResponse(`Vendor not found with id of ${vendorId}`, 404));
  }
  
  // Implement pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments({ vendorId });
  
  // Build query
  let query = { vendorId };
  
  // Add category filter if provided
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Execute query with pagination
  const products = await Product.find(query)
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-createdAt');
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});