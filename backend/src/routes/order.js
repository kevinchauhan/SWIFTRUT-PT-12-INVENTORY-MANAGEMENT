import express from 'express'
import OrderController from '../controllers/OrderController.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();

router.post('/', authenticate, OrderController.placeOrder);
router.get('/', authenticate, OrderController.getAllOrders);
router.get('/my-orders', authenticate, OrderController.getUserOrders);
router.put('/:id/status', authenticate, OrderController.updateOrderStatus);
router.delete('/:id', authenticate, OrderController.deleteOrder);


export default router;
