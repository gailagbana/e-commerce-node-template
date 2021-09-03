/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const router = require('express').Router();
const { handle404, handleError, setupRequest, processResponse } = require('../middlewares/http');

/** Route Handlers */
const sampleRouteHandler = require('./sample');
const userRouteHandler = require('./user');
const inventoryRouteHandler = require('./inventory');
const categoryRouteHandler = require('./category');
const storeRouteHandler = require('./store');
const cartRouteHandler = require('./cart');
const orderRouteHandler = require('./order');

/** Cross Origin Handling */
router.use(setupRequest);
router.use('/samples', sampleRouteHandler);
router.use('/user', userRouteHandler);
router.use('/inventory', inventoryRouteHandler);
router.use('/category', categoryRouteHandler);
router.use('/cart', cartRouteHandler);
router.use('/store', storeRouteHandler);
router.use('/order', orderRouteHandler);
router.use(processResponse);

/** Static Routes */
router.use('/image/:imageName', () => {});

router.use(handle404);
router.use(handleError);

module.exports = router;
