const {verifyAuthToken} = require('../utilities/encryption');

async function isAuthenticated(request, response, next) {
    try {
        const token = request.header("Authorization");
        if (!token) throw new Error("Access denied. No token provided.");

        const decoded = await verifyAuthToken(token);
        request.user = decoded;
        return next();
    } catch (e) {
        const err = `isAuthenticated: ${e.message}`;
        return next(err);
    }
}

async function isAdmin(request, response, next) {
    try {
        if (request.user.role !== "admin")
        {throw new Error(
        "You don't have enough permission to perform this action"
        );}
        return next();
    } catch (e) {
        const err = `isAdmin: ${e.message}`;
        return next(err);
    }
}

async function isSeller(request, response, next) {
    try {
        if (request.user.role !== "seller")
        throw new Error(
        "You don't have enough permission to perform this action"
        );
        return next();
    } catch (e) {
        const err = `isAdmin: ${e.message}`;
        return next(err);
    }
}

module.exports = {isAuthenticated, isAdmin, isSeller};