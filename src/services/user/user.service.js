const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const { hashObject, verifyObject, generateAuthToken } = require('../../utilities/encryption');

class UserService extends RootService {
    constructor(userController, schemaValidator) {
        /** */
        super();
        this.userController = userController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'UserService';
    }

    async createUser(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createUser.validate(body);
            if (error) throw new Error(error);

            delete body.id;

            body.password = await hashObject(body.password);

            const result = await this.userController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createUser: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async userLogin(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.userLogin.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            let { password, email } = body;
            const user = await this.userController.readRecords({ email });
            if (user.failed) throw new Error(user.error);

            const isPasswordCorrect = await verifyObject(password, user[0].password);
            if (!isPasswordCorrect) throw new Error('Incorrect password');

            const token = await generateAuthToken(user);
            const result = { ...user[0], token };

            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] userLogin: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readUserById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.userController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readUserdById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readUsers(request, next) {
        try {
            const result = await this.userController.readRecords({
                isDeleted: false,
                isActive: true,
            });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readInventories: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readUsersByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.userController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readUsersByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateUserById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.userController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateUserById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateUsers(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.userController.updateRecords(
                { ...seekConditions },
                { ...data }
            );
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult({ ...data, ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateUsers: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteUserById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.userController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteUserById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteUsers(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.userController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteUsers: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = UserService;
