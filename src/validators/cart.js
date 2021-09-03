const Joi = require('@hapi/joi');

addInventoryToCart = Joi.object({
    userId: Joi.string().required(),
    products: Joi.object.required(),
    amount: Joi.string().required(),
});

module.exports = {
    addInventoryToCart,
};
