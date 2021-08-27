const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: "shopper",
        enum: ["shopper","seller", "admin"],
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
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

model('User', UserSchema);
