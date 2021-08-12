/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const { model, Schema } = require('mongoose');

const SampleSchema = new Schema({
    id: {
        type: Number,
        required: true,
        default: 0,
    },
    compoundIndexA: {
        type: String,
        required: true,
    },
    compoundIndexB: {
        type: Number,
        required: true,
    },
    // Model Required fields
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeStamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updatedOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

model('Sample', SampleSchema);
