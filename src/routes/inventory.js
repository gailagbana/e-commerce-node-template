const router = require('express').Router();

const Controller = require('../controllers/index');
const inventorySchemaValidator = require('../validators/inventory');
const InventoryService = require('../services/inventory/inventory.service');

const inventoryController = new Controller('Inventory');
const inventoryService = new InventoryService(inventoryController, inventorySchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await inventoryService.createInventory(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await inventoryService.readInventories(request, next);
            next();
        })
        .get('/filter/items', async (request, response, next) => {
            request.payload = await inventoryService.readInventoryByFilter(request, next);
            next();
        })
        .get('/:id', async (request, response, next) => {
            request.payload = await inventoryService.readInventoryById(request, next);
            next();
        })
        .put('/', async (request, response, next) => {
            request.payload = await inventoryService.updateInventories(request, next);
            next();
        })
        .put('/:id', async (request, response, next) => {
            request.payload = await inventoryService.updateInventoryById(request, next);
            next();
        })
        .delete('/', async (request, response, next) => {
            request.payload = await inventoryService.deleteInventory(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await inventoryService.deleteInventoryById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /inventory: ${e.message}`);
} finally {
    module.exports = router;
}
