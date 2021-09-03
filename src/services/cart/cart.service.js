const RootService = require('../_root');

class CartService extends RootService {
    constructor(cartController, schemaValidator) {
        super();
        this.cartController = cartController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'CartService';
    }

    async createCart(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createCart.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            const result = await this.cartController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createCart: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async addInventoryToCart(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.cartController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] addInventoryToCart: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readCartById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.cartController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readCartById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async removeInventoryByIdFromCartById(request, next) {
        try {
            const { id, inventoryId } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));
            if (!inventoryId)
                return next(this.processFailedResponse('Invalid inventory supplied.'));

            const userCart = await this.cartController.readRecords({ id });
            if (userCart.failed) throw new Error(userCart.error);

            const result = await this.cartController.deleteRecords(userCart.inventoryId);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] removeInventoryByIdFromCartById: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = CartService;
