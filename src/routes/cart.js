const router = require('express').Router();
const Controller = require('../controllers/index');
const cartSchemaValidator = require('../validators/cart');

const { isAuthenticated } = require('../utilities/encryption');
const cartController = new Controller('Cart');
const SampleService = require('../services/cart/cart.service');

const cartService = new SampleService(cartController, cartSchemaValidator);

try {
    router
        .post('/'[isAuthenticated], async (request, response, next) => {
            request.payload = await cartService.createCart(request, next);
            next();
        })
        .get('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await cartService.readCartById(request, next);
            next();
        })
        .put('/:id/:inventoryId'[isAuthenticated], async (request, response, next) => {
            request.payload = await cartService.removeInventoryByIdFromCartById(request, next);
            next();
        })
        .delete('/:id/:inventoryId'[isAuthenticated], async (request, response, next) => {
            request.payload = await cartService.removeInventoryByIdFromCartById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /Cart: ${e.message}`);
} finally {
    module.exports = router;
}
