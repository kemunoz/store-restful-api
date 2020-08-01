const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');
const checkAuth = require('../middleware/check-auth');

router.get('/',ProductsController.products_get_all);
router.get('/:id',ProductsController.products_get_byId);
router.post('/',checkAuth,ProductsController.products_create_product);
router.patch('/:id', ProductsController.products_update_product);
router.delete('/:id', ProductsController.products_delete_product);

module.exports = router;