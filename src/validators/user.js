const Joi = require('@hapi/joi');

const createUser = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    userName: Joi.string().min(6).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().required(),
});

const userLogin = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(3).required(),
});

module.exports = { createUser, userLogin };
