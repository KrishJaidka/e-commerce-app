const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, checkOwnership } = require('../middleware/auth');
const {
    addProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getSellerProducts
} = require('../controllers/productLogic');

// Public routes (no authentication required)
router.get('/', getProducts);           // Browse all products with filters
router.get('/:id', getProduct);         // View single product details

// Seller-only routes (authentication + role check required)
router.post('/', authenticateToken, requireRole(['seller']), addProduct);
router.patch('/:id', authenticateToken, requireRole(['seller']), updateProduct);
router.delete('/:id', authenticateToken, requireRole(['seller']), deleteProduct);

// Seller dashboard route
router.get('/seller/my-products', authenticateToken, requireRole(['seller']), getSellerProducts);

module.exports = router;
