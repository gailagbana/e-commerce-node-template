const RootService = require('../_root');
const { buildQuery } = require('../../utilities/query');

class CategoryService extends RootService {
    constructor(categoryController, schemaValidator) {
        super();
        this.categoryController = categoryController;
        this.schemaValidator = schemaValidator;
        this.serviceName = 'CategoryService';
    }

    async createCategory(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.createCategory.validate(body);
            if (error) throw new Error(error);

            delete body.id;
            const result = await this.categoryController.createRecord({ ...body });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] createCategory: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readCategories(request, next) {
        try {
            const result = await this.categoryController.readRecords({
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
                `[${this.serviceName}] readCategories: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readCategoryById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.categoryController.readRecords({ id, isActive: true });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processSingleRead(result[0]);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateCategoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async readCategoryByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.categoryController, query);
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processMultipleReadResults(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] readCategoryByFilter: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateCategoryById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.categoryController.updateRecords({ id }, { ...data });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processUpdateResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] updateCategoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async updateCategories(request, next) {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.categoryController.updateRecords(
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
                `[${this.serviceName}] updateCategories: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteCategoryById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse('Invalid ID supplied.'));

            const result = await this.categoryController.deleteRecords({ id });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult(result);
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteCategoryById: ${e.message}`,
                500
            );
            return next(err);
        }
    }

    async deleteCategory(request, next) {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options);

            const result = await this.categoryController.deleteRecords({ ...seekConditions });
            if (result.failed) {
                throw new Error(result.error);
            } else {
                return this.processDeleteResult({ ...result });
            }
        } catch (e) {
            const err = this.processFailedResponse(
                `[${this.serviceName}] deleteCategory: ${e.message}`,
                500
            );
            return next(err);
        }
    }
}

module.exports = CategoryService;
