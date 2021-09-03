const router = require('express').Router();
const Controller = require('../controllers/index');
const userSchemaValidator = require('../validators/user');

const { isAdmin, isAuthenticated } = require('../utilities/encryption');
const userController = new Controller('User');
const SampleService = require('../services/user/user.service');

const userService = new SampleService(userController, userSchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await userService.createUser(request, next);
            next();
        })
        .post('/login', async (requesst, response, next) => {
            request.payload = await userService.userLogin(request, next);
            next();
        })
        .get('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.readUsers(request, next);
            next();
        })
        .get('/filter/users'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.readUsersByFilter(request, next);
            next();
        })
        .get('/:id'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.readUserById(request, next);
            next();
        })
        .put('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.updateUsers(request, next);
            next();
        })
        .put('/:id'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.updateUserById(request, next);
            next();
        })
        .delete('/'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.deleteUsers(request, next);
            next();
        })
        .delete('/:id'[(isAuthenticated, isAdmin)], async (request, response, next) => {
            request.payload = await userService.deleteUserById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /user: ${e.message}`);
} finally {
    module.exports = router;
}
