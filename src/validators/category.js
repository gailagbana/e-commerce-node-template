const Joi = require('@hapi/joi');

createCategory = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string(),
});
module.exports = {
    createCategory,
};
