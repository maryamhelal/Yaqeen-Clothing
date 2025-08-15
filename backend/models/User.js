const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    city: String,
    area: String,
    street: String,
    landmarks: String,
    residenceType: {
      type: String,
      enum: ["apartment", "private_house", "work"],
    },
    floor: Number,
    apartment: Number,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: addressSchema,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    emailPreferences: {
      promotionalEmails: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      unsubscribeToken: { type: String, unique: true, sparse: true },
      lastEmailSent: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
