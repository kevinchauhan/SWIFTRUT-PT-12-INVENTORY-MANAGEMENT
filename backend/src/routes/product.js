import express from 'express'
import ProductController from '../controllers/ProductController.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post('/', authenticate, ProductController.addProduct);
router.put('/:id', authenticate, ProductController.editProduct);
router.delete('/:id', authenticate, ProductController.deleteProduct);

export default router;
