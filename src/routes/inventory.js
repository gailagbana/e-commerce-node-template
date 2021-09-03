const router = require('express').Router();

const Controller = require('../controllers/index');
const inventorySchemaValidator = require('../validators/inventory');
const InventoryService = require('../services/inventory/inventory.service');

const { isAdmin, isSeller, isAuthenticated } = require('../utilities/encryption');
const inventoryController = new Controller('Inventory');
const inventoryService = new InventoryService(inventoryController, inventorySchemaValidator);

try {
    router
        .post('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await inventoryService.createInventory(request, next);
            next();
        })
        .get('/'[isAuthenticated], async (request, response, next) => {
            request.payload = await inventoryService.readInventories(request, next);
            next();
        })
        .get('/filter/inventories'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await inventoryService.readInventoryByFilter(request, next);
            next();
        })
        .get('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await inventoryService.readInventoryById(request, next);
            next();
        })
        .put('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await inventoryService.updateInventories(request, next);
            next();
        })
        .put('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await inventoryService.updateInventoryById(request, next);
            next();
        })
        .delete('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await inventoryService.deleteInventory(request, next);
            next();
        })
        .delete('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await inventoryService.deleteInventoryById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /inventory: ${e.message}`);
} finally {
    module.exports = router;
}
