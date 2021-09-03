const router = require('express').Router();
const Controller = require('../controllers/index');
const orderSchemaValidator = require('../validators/order');

const { isAdmin, isSeller, isAuthenticated } = require('../utilities/encryption');
const orderController = new Controller('Order');
const SampleService = require('../services/order/order.service');

const orderService = new SampleService(orderController, orderSchemaValidator);

try {
    router
        .post('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await orderService.createOrder(request, next);
            next();
        })
        .get('/'[isAuthenticated], async (request, response, next) => {
            request.payload = await orderService.readOrders(request, next);
            next();
        })
        .get(
            '/filter/Orders'[(isAuthenticated, isAdmin || isSeller)],
            async (request, response, next) => {
                request.payload = await orderService.readOrdersByFilter(request, next);
                next();
            }
        )
        .get('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await orderService.readOrderById(request, next);
            next();
        })
        .put('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await orderService.updateOrders(request, next);
            next();
        })
        .put('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await orderService.updateOrderById(request, next);
            next();
        })
        .delete('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await orderService.cancelOrders(request, next);
            next();
        })
        .delete('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await orderService.cancelOrderById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /order: ${e.message}`);
} finally {
    module.exports = router;
}
