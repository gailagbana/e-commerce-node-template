const RootService = require('../_root');
const { buildQuery } = require('../../utilities/query');

class StoreService extends RootService {
    constructor(storeController, schemaValidator) {
        super();
        this.storeController = storeController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'StoreService';
    }

    async createStore(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createStore.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            const result = await this.storeController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createStore: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readStores(request, next) {
        try {
            const result = await this.storeController.readRecords({
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
                `[${this.serviceName}] readStores: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readStoreById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.storeController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readStoreById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readStoresByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.storeController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readStoresByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateStoreById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.storeController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateStoreById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateStores(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.storesController.updateRecords(
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
                `[${this.serviceName}] updateStores: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteStoreById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.storeController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteStoreById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteStores(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.storeController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteStores: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = StoreService;
