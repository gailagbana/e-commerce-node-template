const router = require('express').Router();

const Controller = require('../controllers/index');
const categorySchemaValidator = require('../validators/category');
const CategoryService = require('../services/category/category.service');

const { isAdmin, isAuthenticated, isSeller } = require('../utilities/encryption');
const categoryController = new Controller('Category');
const categoryService = new CategoryService(categoryController, categorySchemaValidator);

try {
    router
        .post('/'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await categoryService.createCategory(request, next);
            next();
        })
        .get('/'[isAuthenticated], async (request, response, next) => {
            request.payload = await categoryService.readCategories(request, next);
            next();
        })
        .get('/filter/categories'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await categoryService.readCategoryByFilter(request, next);
            next();
        })
        .get('/:id'[isAuthenticated], async (request, response, next) => {
            request.payload = await categoryService.readCategoryById(request, next);
            next();
        })
        .put('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await categoryService.updateCategories(request, next);
            next();
        })
        .put('/:id'[(isAuthenticated, isAdmin || isSeller)], async (request, response, next) => {
            request.payload = await categoryService.updateCategoryById(request, next);
            next();
        })
        .delete('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await categoryService.deleteCategory(request, next);
            next();
        })
        .delete('/:id'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await categoryService.deleteCategoryById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /category: ${e.message}`);
} finally {
    module.exports = router;
}
