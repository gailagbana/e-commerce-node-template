/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const mongoose = require('mongoose');

class Controller {
    constructor(modelName) {
        this.model = mongoose.model(modelName);
    }

    static deleteRecordMetadata(record) {
        const recordToMutate = { ...record };

        delete recordToMutate.timeStamp;
        delete recordToMutate.createdOn;
        delete recordToMutate.updatedOn;
        delete recordToMutate._v;

        return { ...recordToMutate };
    }

    static jsonize(data) {
        return JSON.parse(JSON.stringify(data));
    }

    static async setUniqueKey(model, _id, timeStamp) {
        const n = (await model.estimatedDocumentCount({ timeStamp: { $lt: timeStamp } })) + 1;
        await model.updateOne({ _id }, { id: n });
        return n;
    }

    async createRecord(data) {
        try {
            const recordToCreate = new this.model({ ...data });
            const createdRecord = await recordToCreate.save();

            return {
                ...Controller.jsonize(createdRecord),
                id: await Controller.setUniqueKey(
                    this.model,
                    createdRecord._id,
                    createdRecord.timeStamp
                ),
            };
        } catch (e) {
            console.log(`[SampleController] createRecord Error: ${e.message}`);
            return null;
        }
    }

    async readRecords(
        conditions,
        fieldsToReturn = '',
        sortOptions = '',
        count = false,
        skip = 0,
        limit = Number.MAX_SAFE_INTEGER
    ) {
        try {
            let result = null;
            if (count) {
                result = await this.model
                    .countDocuments({ ...conditions })
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions);
                return { count: result };
            }
            result = await this.model
                .find({ ...conditions }, fieldsToReturn)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions);
            return Controller.jsonize([...result]);
        } catch (e) {
            console.log(`[SampleController] readRecords: ${e.message}`);
            return null;
        }
    }

    async updateRecords(conditions, data) {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    ...dataToSet,
                    $currentDate: { updatedOn: true },
                }
            );

            return Controller.jsonize({ ...result, data });
        } catch (e) {
            console.log(`[SampleController] updateRecords Error: ${e.message}`);
            return null;
        }
    }

    async deleteRecords(conditions) {
        try {
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    isActive: false,
                    isDeleted: true,
                    $currentDate: { updatedOn: true },
                }
            );

            return Controller.jsonize(result);
        } catch (e) {
            console.log(`[SampleController] deleteRecords Error: ${e.message}`);
            return null;
        }
    }
}

module.exports = Controller;
