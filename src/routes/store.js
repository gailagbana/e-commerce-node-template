const router = require('express').Router();
const Controller = require('../controllers/index');
const storeSchemaValidator = require('../validators/store');

const { isAdmin, isSeller, isAuthenticated } = require('../utilities/encryption');
const storeController = new Controller('Store');
const SampleService = require('../services/store/store.service');

const storeService = new SampleService(storeController, storeSchemaValidator);

try {
    router
        .post('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await storeService.createStore(request, next);
            next();
        })

        .get('/'[isAuthenticated], async (request, response, next) => {
            request.payload = await storeService.readStores(request, next);
            next();
        })
        .get('/filter/Stores'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await storeService.readStoresByFilter(request, next);
            next();
        })
        .get('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await storeService.readStoreById(request, next);
            next();
        })
        .put('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await storeService.updateStores(request, next);
            next();
        })
        .put('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await storeService.updateStoreById(request, next);
            next();
        })
        .delete('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await storeService.deleteStores(request, next);
            next();
        })
        .delete('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await storeService.deleteStoreById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /store: ${e.message}`);
} finally {
    module.exports = router;
}
