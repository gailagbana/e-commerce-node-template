const router = require('express').Router();
const Controller = require('../controllers/index');
const userSchemaValidator = require('../validators/user');

const { isAdmin, isSeller, isAuthenticated } = require('../utilities/encryption');
const userController = new Controller('User');
const SampleService = require('../services/user/user.service');

const userService = new SampleService(userController, userSchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await userService.createUser(request, next);
            next();
        })
        .post('/login', async (request, response, next) => {
            request.payload = await userService.userLogin(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await userService.readUsers(request, next);
            next();
        })
        .get('/filter/users', async (request, response, next) => {
            request.payload = await userService.readUsersByFilter(request, next);
            next();
        })
        .get('/:id', async (request, response, next) => {
            request.payload = await userService.readUserById(request, next);
            next();
        })
        .put('/', async (request, response, next) => {
            request.payload = await userService.updateUsers(request, next);
            next();
        })
        .put('/:id', async (request, response, next) => {
            request.payload = await userService.updateUserById(request, next);
            next();
        })
        .delete('/', async (request, response, next) => {
            request.payload = await userService.deleteUsers(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await userService.deleteUserById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /user: ${e.message}`);
} finally {
    module.exports = router;
}
