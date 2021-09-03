const RootService = require('../_root');
const { buildQuery } = require('../../utilities/query');

class InventoryService extends RootService {
    constructor(inventoryController, schemaValidator) {
        super();
        this.inventoryController = inventoryController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'InventoryService';
    }

    async createInventory(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createInventory.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            const result = await this.inventoryController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createInventory: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readInventories(request, next) {
        try {
            const result = await this.inventoryController.readRecords({
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

    async readInventoryById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.inventoryController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readInventoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readInventoryByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.inventoryController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readInventoryByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateInventoryById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.inventoryController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateInventoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateInventories(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.inventoryController.updateRecords(
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
                `[${this.serviceName}] updateInventories: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteInventoryById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.inventoryController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteInventoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteInventory(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.inventoryController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteInventory: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = InventoryService;
