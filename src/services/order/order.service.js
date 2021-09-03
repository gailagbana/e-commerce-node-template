const RootService = require('../_root');
const { buildQuery } = require('../../utilities/query');

class OrderService extends RootService {
    constructor(orderController, schemaValidator) {
        super();
        this.orderController = orderController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'OrderService';
    }

    async createOrder(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createOrder.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            const result = await this.orderController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createOrder: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readOrders(request, next) {
        try {
            const result = await this.orderController.readRecords({
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
                `[${this.serviceName}] readOrders: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readOrderById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.orderController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readOrderById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readOrderByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.orderController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readOrderByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateOrderById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.orderController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateOrderyById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateOrders(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.orderController.updateRecords(
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
                `[${this.serviceName}] updateOrder: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async cancelOrderById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.orderController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] cancelOrderById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async cancelOrders(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.orderController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] cancelOrders: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = OrderService;
