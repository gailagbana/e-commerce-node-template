const { model, Schema } = require('mongoose');

const InventorySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    sellerId: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number, 
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
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

model('Inventory', InventorySchema);
