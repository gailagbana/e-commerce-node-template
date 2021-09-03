const { model, Schema } = require("mongoose");

const TokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
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

model("Token", TokenSchema);
