const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const sellerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Seller", sellerSchema);
